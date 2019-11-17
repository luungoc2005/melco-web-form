import React, { useRef, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  scrollButton: {
    minWidth: 28,
    width: 28,
    minHeight: 32,
    height: 32,
    position: 'absolute',
    overflow: 'hidden',
    padding: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    marginTop: -5,
    '&:disabled': {
      display: 'none',
    }
  },
  previousButton: {
    left: -28,
  },
  nextButton: {
    right: -28,
  },
  animateScroll: {
    left: 0,
    position: 'absolute',
    transition: 'left .8s ease',
  },
  animateScrollRapid: {
    left: 0,
    position: 'absolute',
    transition: 'left .4s ease',
  },
  animateScrollNear: {
    left: 0,
    position: 'absolute',
    transition: 'left .3s ease-in-out',
  }
})

export const HScroll = ({
  scrollUnit,
  children,
}) => {
  const classes = useStyles();

  const prevButton = useRef();
  const nextButton = useRef();
  const scrollDiv = useRef();
  const animateDiv = useRef();
  const currentScrollLeft = useRef();

  let scrollStartTimer = 0;
  let scrollSyncTimer = 0;
  let scrollDurationTimer = 0;

  const clearScrollTimers = () => {
    clearInterval(scrollStartTimer);
    clearInterval(scrollSyncTimer);
    clearTimeout(scrollDurationTimer);

    document.body.removeChild(animateDiv.current);

    animateDiv.current = null;

    scrollStartTimer = null;
    scrollSyncTimer = null;
    scrollDurationTimer = null; 
  }
  
  const updateScrollButtons = () => {
    prevButton.current.disabled = (!scrollDiv.current 
      || Math.round(scrollDiv.current.scrollLeft) <= 0);
    nextButton.current.disabled = (!scrollDiv.current 
      || Math.round(scrollDiv.current.scrollLeft) >= Math.round(scrollDiv.current.scrollWidth - scrollDiv.current.offsetWidth));
  }

  const scrollBy = (direction) => {

    let easingClassName = classes.animateScroll;

    //cancel existing animation when clicking fast
    if (animateDiv.current) {
        easingClassName = classes.animateScrollRapid;
        clearScrollTimers();
    }

    const unit = scrollAmount(direction);
    const scrollLeft = scrollDiv.current.scrollLeft;
    let dest = scrollLeft + unit;

    //don't exceed boundaries
    dest = Math.max(dest, 0);
    dest = Math.min(dest, scrollDiv.current.scrollWidth - scrollDiv.current.offsetWidth);

    if (scrollLeft == dest) return;

    //use proper easing curve when distance is small
    if (Math.abs(dest - scrollLeft) < 60) {
      easingClassName = classes.animateScrollNear;
    }

    animateDiv.current = document.createElement('div');
    animateDiv.current.className = easingClassName;
    animateDiv.current.style.left = scrollLeft + 'px';
    document.body.appendChild(animateDiv.current);

    //capture ComputedStyle every millisecond
    scrollSyncTimer = window.setInterval(() => {
        const num = parseFloat(getComputedStyle(animateDiv.current).left);
        scrollDiv.current.scrollLeft = num;
    }, 1);

    //don't let the browser optimize the setting of 'this.animateDiv.style.left' - we need this to change values to trigger the CSS animation
    //we accomplish this by calling 'this.animateDiv.style.left' off this thread, using setTimeout
    scrollStartTimer = window.setTimeout(() => {
        animateDiv.current.style.left = dest + 'px';

        let duration = 1000 * parseFloat(getComputedStyle(animateDiv.current).transitionDuration);
        if (duration) {
          //slightly longer that the CSS time so we don't cut it off prematurely
          duration += 50;

          //stop capturing
          scrollDurationTimer = window.setTimeout(() => clearScrollTimers(), duration);
        } else {
          clearScrollTimers();
        }
    }, 1);
  }

  const scrollAmount = (direction) => {
    if (scrollUnit == 'item') {
      // TODO: this can be improved by finding the actual item in the viewport,
      // instead of the first item, because they may not have the same width.
      // the width of the li is measured on demand in case CSS has resized it
      const firstItem = scrollDiv.current.querySelector('button');
      return firstItem ? direction * firstItem.offsetWidth : 0;
    } 
    else {
      // TODO: use a good page size. This can be improved by finding the next clipped item.
      return direction * (scrollDiv.current.offsetWidth - 70);
    }
  }

  useEffect(() => {
    scrollDiv.current.style.marginBottom = -(scrollDiv.current.offsetHeight - scrollDiv.current.clientHeight) + 'px';
    updateScrollButtons();
  }, [])

  useEffect(() => {
    // scrollDiv.current.scrollLeft = 0;
    updateScrollButtons();
  })

  return (
    <>
      <Button 
        ref={prevButton}
        className={[classes.scrollButton, classes.previousButton].join(' ')}
        onClick={() => scrollBy(-1)} 
        variant="outlined"
      >
        <Icon>navigate_before</Icon>
      </Button>
      <div
        style={{
          overflow: 'hidden',
        }}
      >
          <div
            ref={scrollDiv} 
            onScroll={updateScrollButtons} style={{
              overflowX: 'scroll',
              overflowY: 'hidden',
              paddingBottom: 20,
            }}
          >
              { children }
          </div>
      </div>
      <Button 
        ref={nextButton} 
        className={[classes.scrollButton, classes.nextButton].join(' ')}
        onClick={() => scrollBy(1)}
        variant="outlined"
      >
        <Icon>navigate_next</Icon>
      </Button>
    </>
  )
}

export default HScroll;