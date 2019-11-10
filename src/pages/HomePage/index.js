import React, { useContext, useState, useEffect } from 'react';
import _range from 'lodash/range';
import { getSearchParams, RestaurantAPI } from '../../api';
import { AppContext } from '../../context';
import { RestaurantBanner } from '../../components/restaurant_banner';
import { Section } from '../../components/section';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Typography from '@material-ui/core/Typography';

import _addDays from 'date-fns/addDays';
import _format from 'date-fns/format';
import _parse from 'date-fns/parse';
import _differenceInHours from 'date-fns/differenceInHours';

const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const useStyles = makeStyles(theme => ({
  buttonNoTransform: {
    textTransform: 'none',
    label: {
      display: 'flex',
    }
  }
})) 

export const HomePage = () => {
  const classes = useStyles();
  const { restaurantData, formData, setFormData, setCurrentPath } = useContext(AppContext) || {};
  const [timeRanges, setTimeRanges] = useState([])
  useEffect(() => {
    console.log(getSearchParams())
    async function fetchData() {
      const { micrositeId } = getSearchParams();
      const resp = await RestaurantAPI.getRestaurantAvailability({ 
        micrositeId,
        partySize: formData.partySize,
        visitDate: _format(formData.visitDate, 'yyyy-MM-d')
      })
      setTimeRanges(resp.data || [])
    }
    fetchData();
  }, [formData.visitDate, formData.partySize])

  const getDateButton = (daysFromNow) => {
    const today = new Date();
    const retDay = _addDays(today, daysFromNow);

    return {
      value: retDay,
      label: daysFromNow == 0
        ? 'Today'
        : daysFromNow == 1
          ? 'Tomorrow'
          : DAYS_OF_WEEK[retDay.getDay()]
    }
  }

  return (
    <>
      <RestaurantBanner restaurantData={restaurantData} />
      <Section title='Guests'>
        {_range(1, 7).map((value) => 
        <ToggleButton 
          key={value}
          value='check'
          aria-label={`${value} persons`}
          selected={formData.partySize === value}
          onChange={() => setFormData({...formData, partySize: value})}
          style={{ marginRight: 10 }}
          color="primary"
          variant="contained"
        >
          {value}
        </ToggleButton>)}
      </Section>
      <Section title='Dates'>
        {_range(0, 5).map((value) => {
          const dateValue = getDateButton(value);
          return <ToggleButton
            key={value}
            className={classes.buttonNoTransform}
            value='check'
            aria-label={dateValue.label}
            selected={_differenceInHours(dateValue.value, formData.visitDate) === 0}
            onChange={() => setFormData({...formData, visitDate: dateValue.value})}
            style={{ marginRight: 10 }}
            color="primary"
            variant="contained"
          >
            <div>
              <strong>{_format(dateValue.value, 'd MMM')}</strong>
              <div>{dateValue.label}</div>
            </div>
          </ToggleButton>
        })}
      </Section>
      <Section title='Time'>
        {timeRanges.map((value) => <ToggleButton
          color="primary"
          variant="contained"
          value='check'
          key={value}
          selected={formData.visitTime === value}
          aria-label={value}
          onChange={() => setFormData({...formData, visitTime: value})}
          style={{ marginRight: 10 }}
        >

        </ToggleButton>)}
      </Section>
      <Button
        color="primary"
        fullWidth
        variant="contained"
        onClick={() => setCurrentPath('/form')}
      >
        Continue
      </Button>
    </>
  )
}

export default HomePage