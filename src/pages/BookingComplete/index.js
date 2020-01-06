import React, { useContext, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { getSearchParams, RestaurantAPI } from '../../api';
import { _messengerExtensions } from '../../index';

import { AppContext } from '../../context';

import _format from 'date-fns/format';

import { useIntl, FormattedMessage } from 'react-intl';
import { dateFnsLocales } from '../../intl';

export const BookingComplete = () => {
  const { 
    formData, 
    bookingLoading,
    setBookingLoading,
    bookingError,
    setBookingError,
    windowCloseError,
    setWindowCloseError,
  } = useContext(AppContext) || {};

  useEffect(() => {
    const submitBooking = async () => {
      setBookingError(false);
      setBookingLoading(true);
  
      const { micrositeId, __bb_platform, ...params } = getSearchParams();
      console.log(params)
  
      const dialCode = formData.country.dialCode.toString();
      let mobile = formData.phoneNumber;
      const dialCodeIdx = mobile.indexOf(dialCode);
      if (dialCodeIdx > -1) {
        mobile = mobile.substring(dialCodeIdx + dialCode.length).trim();
      }
      
      const requestData = {
        micrositeName: micrositeId,
        visitDate: _format(formData.visitDate, 'yyyy-MM-dd'),
        visitTime: formData.visitTime,
        partySize: formData.partySize,
        specialRequests: formData.specialRequests,
        bookingReasonIds: formData.bookingReasons
          .filter(item => item.checked)
          .map(item => item.id),
        customer: {
          title: formData.title,
          firstName: formData.firstName,
          surname: formData.lastName,
          mobileCountryCode: formData.country.dialCode,
          mobile,
        }
      }
      
      try {
        await RestaurantAPI.bookRestaurant({ params, data: requestData });
      }
      catch (e) {
        setBookingLoading(false);
        setBookingError(e && e.message 
          ? e.message 
          : 'Unknown error'
        );
      }
  
      setBookingLoading(false);

      try {
        setWindowCloseError(_messengerExtensions);

        if (_messengerExtensions && _messengerExtensions.requestCloseBrowser) {
          _messengerExtensions.requestCloseBrowser(
            function success() {
              console.log("Webview closing");
            },
            function error(err) {
              setWindowCloseError(err);
            });
        }

        window.close();
      }
      catch (we) {
        setWindowCloseError(we);
      }
    }
    submitBooking();
  }, [])

  return (<div style={{ textAlign: 'center' }}>
    {bookingError 
    ? <>
      <Typography variant="body1">
        <FormattedMessage 
          id="booking_complete.booking_error.title"
          defaultMessage="Your booking is not complete"
        />
      </Typography>
      <Typography variant="body2" gutterBottom>
        <FormattedMessage 
          id="booking_complete.booking_error.message"
          defaultMessage="An error orcurred. Please click the Back button and try again."
        />
      </Typography>
      <Typography variant="caption">{bookingError}</Typography>
    </>
    : bookingLoading
    ? <>
      <CircularProgress />
      <Typography variant="body2">
        <FormattedMessage 
          id="booking_complete.messages.wait"
          defaultMessage="Please wait..."
        />
      </Typography>
    </>
    : <>
      <Typography variant="body1">
        <FormattedMessage 
          id="booking_complete.messages.complete_title"
          defaultMessage="Your booking is complete"
        />
      </Typography>
      <Typography variant="body2">
        <FormattedMessage 
          id="booking_complete.messages.complete_message"
          defaultMessage="Please click the Back button to go back to the chat."
        />
      </Typography>  
    </>}
    {/* <Typography variant="caption">MessengerExtensions?: {windowCloseError && windowCloseError.toSource ? windowCloseError.toSource() : Object.prototype.toString.call(windowCloseError)}</Typography>
    <Typography variant="caption">window.name == {window.name}</Typography> */}
  </div>)
}

export default BookingComplete;