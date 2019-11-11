import React, { useContext, useState, useEffect, useRef } from 'react';

import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../App';
import { getSearchParams, RestaurantAPI } from '../../api';
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

import _range from 'lodash/range';
import _addDays from 'date-fns/addDays';
import _format from 'date-fns/format';
import _parse from 'date-fns/parse';
import _differenceInHours from 'date-fns/differenceInHours';

const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const useStyles = makeStyles(theme => ({
  buttonNoTransform: {
    textTransform: 'none',
    fontWeight: 'initial',
  }
}))

export const HomePage = () => {
  const classes = useStyles();
  const { restaurantData, restaurantSetup, formData, setFormData, setCurrentPath } = useContext(AppContext) || {};
  const [timeRanges, setTimeRanges] = useState(null);
  const [timeRangesLoading, setTimeRangesLoading] = useState(false);
  const { minOnlinePartySize, maxOnlinePartySize, acceptBookingsDaysInAdvance } = restaurantSetup;
  const inputRef = useRef();
  const today = new Date();
  const DEFAULT_SHOWN_DATES = 5;
  const otherDateSelected = _differenceInHours(_addDays(today, DEFAULT_SHOWN_DATES - 1), formData.visitDate) < 0
  useEffect(() => {
    console.log(getSearchParams())
    async function fetchData() {
      setTimeRanges(null);
      setTimeRangesLoading(true);
      setFormData({...formData, visitTime: ''});

      const { micrositeId } = getSearchParams();
      const resp = await RestaurantAPI.getRestaurantAvailability({ 
        micrositeId,
        partySize: formData.partySize,
        visitDate: _format(formData.visitDate, 'yyyy-MM-d')
      });

      setTimeRanges(resp.data || []);
      setTimeRangesLoading(false);
    }
    fetchData();
  }, [formData.visitDate, formData.partySize])

  const getDateButton = (daysFromNow) => {
    const retDay = _addDays(today, daysFromNow);

    return {
      value: retDay,
      label: daysFromNow === 0
        ? 'Today'
        : daysFromNow === 1
          ? 'Tomorrow'
          : DAYS_OF_WEEK[retDay.getDay()]
    }
  }

  return (
    <>
      <RestaurantBanner restaurantData={restaurantData} />
      {restaurantSetup && <>
      <Section title='Guests' style={{ textAlign: 'center' }}>
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
      <Section title='Dates' style={{ textAlign: 'center' }}>
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
              <strong>{_format(dateValue.value, 'd MMM')}</strong>
              <div>{dateValue.label}</div>
            </div>
          </ToggleButton>
        })}
        {acceptBookingsDaysInAdvance > DEFAULT_SHOWN_DATES && <>
          <DatePicker
            label="Basic example"
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
            ? <Icon style={{ color: SECONDARY_COLOR }}>calendar_today</Icon>
            : <div>
              <strong>{_format(formData.visitDate, 'd MMM')}</strong>
              <div>{DAYS_OF_WEEK[formData.visitDate.getDay()]}</div>
            </div>}
          </ToggleButton>
        </>}
      </Section>
      <Section title='Time' style={{ textAlign: 'center' }}>
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
          style={{ marginRight: 10, marginTop: 10, padding: '0 32px' }}
        >
          {value}
        </ToggleButton>)
        : timeRanges.length === 0 && <>
          <Icon>sentiment_dissatisfied</Icon>
          <div>There are no available time slots for this date.</div>
          <div>Please try another one.</div>
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
        Continue
      </Button> 
      </>}
    </>
  )
}

export default HomePage