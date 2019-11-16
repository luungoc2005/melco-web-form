import React, { useContext, useEffect } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import { getSearchParams, RestaurantAPI } from '../../api';
import { _messengerExtensions } from '../../index';

import { AppContext } from '../../context';

import _format from 'date-fns/format';

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
  const { bookingReasons } = formData;

  useEffect(() => {
    const submitBooking = async () => {
      setBookingError(false);
      setBookingLoading(true);
  
      const { micrositeId, ...params } = getSearchParams();
      console.log(params)
  
      const dialCode = formData.country.dialCode.toString();
      let mobile = formData.phoneNumber;
      const dialCodeIdx = mobile.indexOf(dialCode);
      if (dialCodeIdx > -1) {
        mobile = mobile.substring(dialCodeIdx + dialCode.length).trim();
      }
      
      const requestData = {
        micrositeName: micrositeId,
        visitDate: _format(formData.visitDate, 'yyyy-MM-d'),
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
        setBookingError(e);
      }
  
      setBookingLoading(false);

      if (_messengerExtensions && _messengerExtensions.requestCloseBrowser) {
        _messengerExtensions.requestCloseBrowser(function success() {
            console.log("Webview closing");
        }, function error(err) {
          setWindowCloseError(err);
        });
      }
      else {
        window.close();
      }
      setWindowCloseError(_messengerExtensions);
    }
    submitBooking();
  }, [])

  return (<div style={{ textAlign: 'center' }}>
    {bookingError 
    ? <>
      <Typography variant="body1">Your booking is not complete</Typography>
      <Typography variant="body2" gutterBottom>An error orcurred. Please click the Back button and try again.</Typography>
      <Typography variant="caption">{bookingError}</Typography>
    </>
    : bookingLoading
    ? <>
      <CircularProgress />
      <Typography variant="body2">Please wait...</Typography>
    </>
    : <>
      <Typography variant="body1">Your booking is complete</Typography>
      <Typography variant="body2">Please click the Back button to go back to the chat.</Typography>  
      <Typography variant="caption">MessengerExtensions?: {windowCloseError}</Typography>
    </>}
  </div>)
}

export default BookingComplete;