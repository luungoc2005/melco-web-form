import React, { useContext, useRef, useEffect } from 'react';

import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../App';
// import { getSearchParams, RestaurantAPI } from '../../api';
import { AppContext } from '../../context';
import { RestaurantBanner } from '../../components/restaurant_banner';
import { Section } from '../../components/section';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker } from "@material-ui/pickers";
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// import Typography from '@material-ui/core/Typography';

import { dateFnsLocales } from '../../intl';
import { formatTime } from '../../utils';

import { useIntl, FormattedMessage } from 'react-intl';

import _range from 'lodash/range';
import _addDays from 'date-fns/addDays';
import _format from 'date-fns/format';
import _parse from 'date-fns/parse';
import _differenceInHours from 'date-fns/differenceInHours';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  buttonNoTransform: {
    textTransform: 'none',
    fontWeight: 'initial',
  }
}))

export const HomePage = () => {
  const classes = useStyles();
  const { 
    restaurantData, 
    restaurantSetup, 
    formData, 
    setFormData, 
    setCurrentPath,
    timeRanges,
    timeRangesLoading,
  } = useContext(AppContext) || {};
  const intl = useIntl();
  const { minOnlinePartySize, maxOnlinePartySize, acceptBookingsDaysInAdvance } = restaurantSetup;
  const inputRef = useRef();
  const today = new Date();
  const DEFAULT_SHOWN_DATES = 5;
  const otherDateSelected = _differenceInHours(_addDays(today, DEFAULT_SHOWN_DATES - 1), formData.visitDate) < 0

  useEffect(() => {
    document.title = intl.formatMessage({ 
      id: 'common.document.title',
      defaultMessage: 'Restaurant Booking',
    })
  }, [])

  const getDateButton = (daysFromNow) => {
    const retDay = _addDays(today, daysFromNow);

    return {
      value: retDay,
      label: daysFromNow === 0
        ? intl.formatMessage({ 
            id: 'home.date_button.today',
            defaultMessage: 'Today',
          })
        : daysFromNow === 1
          ? intl.formatMessage({ 
              id: 'home.date_button.tomorrow',
              defaultMessage: 'Tomorrow'
            })
          : intl.formatDate(retDay, {
            weekday: 'short'
          })
    }
  }

  return (
    <>
      <RestaurantBanner restaurantData={restaurantData} />
      {restaurantSetup && <>
      <Section 
        title={intl.formatMessage({ 
          id: 'home.section_guests.title',
          defaultMessage: 'Guests',
        })} 
        className='noScrollBar' 
        style={{ 
          textAlign: 'center', 
          width: '100%',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
        enableScroll={true}
      >
        {_range(minOnlinePartySize, maxOnlinePartySize).map((value) => 
        <ToggleButton 
          key={value}
          value='check'
          aria-label={`${value} persons`}
          selected={formData.partySize === value}
          onChange={() => setFormData({...formData, partySize: value})}
          style={{ marginRight: 10, marginTop: 10, padding: '0 32px' }}
          color="primary"
          variant="contained"
        >
          {value}
        </ToggleButton>)}
      </Section>
      <Section 
        title={intl.formatMessage({ 
          id: 'home.section_dates.title',
          defaultMessage: 'Dates',
        })}
        className='noScrollBar' 
        style={{ 
          textAlign: 'center', 
          width: '100%',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
        enableScroll={true}
      >
        {_range(0, Math.min(DEFAULT_SHOWN_DATES, acceptBookingsDaysInAdvance)).map((value) => {
          const dateValue = getDateButton(value);
          return <ToggleButton
            key={value}
            className={classes.buttonNoTransform}
            value='check'
            aria-label={dateValue.label}
            selected={_differenceInHours(dateValue.value, formData.visitDate) === 0}
            onChange={() => setFormData({...formData, visitDate: dateValue.value})}
            style={{ marginRight: 10, padding: '0 32px', height: 72, marginTop: 10}}
            color="primary"
            variant="contained"
          >
            <div>
              <strong>{_format(dateValue.value, intl.formatMessage({ 
                id: 'home.section_dates.visit_date_format',
                defaultMessage: 'd MMM',
              }), {
                locale: dateFnsLocales[intl.locale]
              })}</strong>
              <div>{dateValue.label}</div>
            </div>
          </ToggleButton>
        })}
        {acceptBookingsDaysInAdvance > DEFAULT_SHOWN_DATES && <>
          <DatePicker
            animateYearScrolling
            inputRef={inputRef}
            style={{ display: 'none' }}
            value={formData.visitDate}
            disablePast
            maxDate={_addDays(today, acceptBookingsDaysInAdvance)}
            onChange={(value) => setFormData({...formData, visitDate: value})}
          />
          <ToggleButton
            onChange={() => inputRef.current && inputRef.current.click()}
            style={{ marginRight: 10, padding: '0 32px', height: 72, marginTop: 10 }}
            color="primary"
            variant="contained"
            value='check'
            selected={otherDateSelected}
            className={classes.buttonNoTransform}
          >
            {!otherDateSelected 
            ? <Icon style={{ color: SECONDARY_COLOR, fontSize: '1.5em' }}>calendar_today</Icon>
            : <div>
              <strong>{_format(formData.visitDate, 'd MMM')}</strong>
              <div>{intl.formatDate(formData.visitDate, { 
                weekday: 'short' 
              })}</div>
            </div>}
          </ToggleButton>
        </>}
      </Section>
      <Section 
        title={intl.formatMessage({ 
          id: 'home.section_time.title',
          defaultMessage: 'Time' ,
        })}
        className='noScrollBar' 
        style={{ 
          textAlign: 'center', 
          width: '100%',
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
        enableScroll={true}
      >
        {timeRangesLoading && <CircularProgress />}
        {Array.isArray(timeRanges) && (timeRanges.length
        ? timeRanges.map((value) => <ToggleButton
          color="primary"
          variant="contained"
          value='check'
          key={value}
          selected={formData.visitTime === value}
          aria-label={value}
          onChange={() => setFormData({...formData, visitTime: value})}
          style={{ marginRight: 10, marginTop: 10, padding: '0 32px', textTransform: 'none' }}
        >
          {formatTime(value, intl)}
        </ToggleButton>)
        : timeRanges.length === 0 && <>
          <Icon>sentiment_dissatisfied</Icon>
          <Typography variant="body2">
            <FormattedMessage 
              id="home.section_time.error_no_range_title"
              defaultMessage="There are no available time slots for this date."
            />
          </Typography>
          <Typography variant="body2">
            <FormattedMessage 
              id="home.section_time.error_no_range_message"
              defaultMessage="Please try another one."
            />
          </Typography>
        </>)}
      </Section>

      <Button
        color="primary"
        fullWidth
        variant="contained"
        onClick={() => setCurrentPath('/form')}
        disabled={
          formData.partySize === '' || 
          formData.visitDate === '' ||
          formData.visitTime === ''
        }
      >
        <FormattedMessage 
          id="common.buttons.continue"
          defaultMessage="Continue"
        />
      </Button>
      </>}
    </>
  )
}

export default HomePage