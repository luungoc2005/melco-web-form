import React, { useState, useEffect } from 'react';
import { AppContext, DEFAULT_FORM_DATA } from './context';
import { getSearchParams, RestaurantAPI } from './api';

import { HomePage } from './pages/HomePage';
import { BookingForm } from './pages/BookingForm';

import { Header } from './components/header';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const PRIMARY_COLOR = '#002B49'
const SECONDARY_COLOR = '#B58D3D'
const GlobalCss = withStyles({
  '@global': {
    '.MuiAppBar-colorPrimary': {
      backgroundColor: 'white',
      color: PRIMARY_COLOR,
    },
    'h5': {
      color: PRIMARY_COLOR,
    },
  },
})(() => null);

function App() {
  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantSetup, setRestaurantSetup] = useState({});
  const [currentPath, setCurrentPath] = useState('/');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  useEffect(() => {
    console.log(getSearchParams())
    const { micrositeId } = getSearchParams();
    async function fetchRestaurantData() {
      const resp = await RestaurantAPI.getRestaurant({ micrositeId })
      setRestaurantData(resp.data);
    }
    async function fetchRestaurantSetup() {
      const resp = await RestaurantAPI.getOnlineBookingSetup({ micrositeId })
      setRestaurantSetup(resp.data);
    }
    fetchRestaurantData();
    fetchRestaurantSetup();
  }, [])

  return (
    <div className="App">
      <GlobalCss />
      <Header>Restaurant Booking</Header>
      {AppContext && <AppContext.Provider value={{
        currentPath,
        setCurrentPath,
        restaurantData,
        restaurantSetup,
        formData,
        setFormData,
      }}>
        {currentPath === '/' && <HomePage />}
        {currentPath === '/form' && <BookingForm />}
      </AppContext.Provider>}
    </div>
  );
}

export default App;
