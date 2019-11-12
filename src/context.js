import React, { createContext } from 'react';

export const DEFAULT_FORM_DATA = {
  partySize: 1,
  visitDate: new Date(),
  visitTime: null,
  title: 'Mr.',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  country: null,
  email: '',
  specialRequests: '',
  bookingReasons: [],
}

export const AppContext = createContext({
  currentPath: '',
  setCurrentPath: () => {},
  restaurantData: null,
  restaurantSetup: null,
  formData: DEFAULT_FORM_DATA,
  setFormData: () => {},
  timeRanges: null,
  timeRangesLoading: false,
})

export default AppContext;