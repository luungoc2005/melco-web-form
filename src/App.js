import React, { useState, useEffect } from 'react';
import { AppContext, DEFAULT_FORM_DATA } from './context';
import { getSearchParams, RestaurantAPI } from './api';

import { HomePage } from './pages/HomePage';
import { BookingForm } from './pages/BookingForm';

import { Header } from './components/header';
import Typography from '@material-ui/core/Typography';
import { withStyles, makeStyles } from '@material-ui/core/styles';

export const PRIMARY_COLOR = '#002B49'
export const SECONDARY_COLOR = '#B58D3D'

const GlobalCss = withStyles({
  '@global': {
    '.MuiAppBar-colorPrimary': {
      backgroundColor: 'white',
      color: PRIMARY_COLOR,
    },

    '.MuiIconButton-root': {
      color: SECONDARY_COLOR,
    },

    '.MuiButton-containedPrimary': {
      backgroundColor: SECONDARY_COLOR,
    },
    '.MuiButton-containedPrimary:hover': {
      backgroundColor: SECONDARY_COLOR,
    },

    '.MuiToggleButton-root': {
      color: '#333',
    },
    '.MuiToggleButton-root.Mui-selected:hover': {
      backgroundColor: SECONDARY_COLOR,
    },
    '.MuiToggleButton-root.Mui-selected': {
      backgroundColor: SECONDARY_COLOR,
      color: 'white',
    },
    '.MuiToggleButton-root.Mui-selected[variant="outlined"]:hover': {
      color: SECONDARY_COLOR,
      backgroundColor: 'transparent',
    },
    '.MuiToggleButton-root.Mui-selected[variant="outlined"]': {
      color: SECONDARY_COLOR,
      backgroundColor: 'transparent',
    },
    
    '.MuiChip-root, .MuiChip-clickable:hover, .MuiChip-clickable:focus': {
      backgroundColor: SECONDARY_COLOR,
      color: 'white',
    },
    '.MuiChip-clickable.MuiChip-outlined:hover, .MuiChip-clickable.MuiChip-outlined:focus, .MuiChip-deletable.MuiChip-outlined:focus': {
      backgroundColor: '#ddd',
      color: '#333',
    },
    '.MuiChip-outlined': {
      border: 0,
      backgroundColor: '#eee',
      color: '#333',
    },

    '.MuiInput-underline:after, .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: `2px solid ${SECONDARY_COLOR}`,
    },
    
    '.MuiCircularProgress-colorPrimary': {
      color: SECONDARY_COLOR,
    },

    '.MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.54) !important',
    },

    'h5': {
      color: PRIMARY_COLOR,
      fontSize: '1.1rem !important',
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
      if (micrositeId) {
        const resp = await RestaurantAPI.getRestaurant({ micrositeId })
        setRestaurantData(resp.data);
      }
    }
    async function fetchRestaurantSetup() {
      if (micrositeId) {
        const resp = await RestaurantAPI.getOnlineBookingSetup({ micrositeId })
        const data = resp.data;
        const { bookingReasons, minOnlinePartySize } = data;
        console.log(bookingReasons)
        setRestaurantSetup(data);
        setFormData({...formData, partySize: minOnlinePartySize, visitTime: '', bookingReasons});
      }
    }
    fetchRestaurantData();
    fetchRestaurantSetup();
  }, [])

  return (
    <div className="App">
      <GlobalCss />
      <div style={{ margin: '0px 12px' }}>
        <Header>
          <Typography variant="h6">Restaurant Booking</Typography>
        </Header>
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
    </div>
  );
}

export default App;
