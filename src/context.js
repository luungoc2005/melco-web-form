import React, { createContext } from 'react';

export const DEFAULT_FORM_DATA = {
  partySize: 1,
  visitDate: new Date(),
  visitTime: null,
  title: 'Mr.',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  specialRequests: '',
}

export const AppContext = createContext({
  currentPath: '',
  setCurrentPath: () => {},
  restaurantData: {},
  restaurantSetup: {},
  formData: DEFAULT_FORM_DATA,
  setFormData: () => {},
})

export default AppContext;