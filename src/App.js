import React, { useState, useEffect } from 'react';
import { AppContext, DEFAULT_FORM_DATA } from './context';
import { getSearchParams, RestaurantAPI } from './api';

import { HomePage } from './pages/HomePage';
import { BookingForm } from './pages/BookingForm';
import { BookingComplete } from './pages/BookingComplete';

// import { Header } from './components/header';
// import Typography from '@material-ui/core/Typography';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import { getCurrentEnvironment, setupMiniprogramSDK } from './mobile';

import _format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';

import {IntlProvider, FormattedMessage} from 'react-intl';

import { messages, dateFnsLocales } from './intl';

export const PRIMARY_COLOR = '#002B49'
export const SECONDARY_COLOR = '#B58D3D'

const GlobalCss = withStyles({
  '@global': {
    '.MuiTypography-root': {
      fontFamily: '"Relative", serif',
    },

    '.MuiAppBar-colorPrimary': {
      backgroundColor: 'white',
      color: PRIMARY_COLOR,
    },

    '.MuiIconButton-root': {
      color: SECONDARY_COLOR,
    },
    '.MuiIconButton-root.secondary': {
      color: '#666',
    },

    '.MuiButton-root': {
      fontFamily: '"Relative", serif',
    },
    '.MuiButton-containedPrimary': {
      backgroundColor: SECONDARY_COLOR,
    },
    '.MuiButton-containedPrimary:hover': {
      backgroundColor: SECONDARY_COLOR,
    },
    '.MuiButton-textSecondary': {
      color: '#333',
    },
    '.MuiButton-textSecondary:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },

    '.MuiToggleButton-root': {
      fontFamily: '"Relative", serif',
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

    '.MuiPickersToolbar-toolbar': {
      backgroundColor: SECONDARY_COLOR, 
    },
    '.MuiPickersBasePicker-container .MuiIconButton-root': {
      backgroundColor: 'transparent',
      color: '#333',
    },
    '.MuiPickersBasePicker-container .MuiPickersDay-daySelected': {
      backgroundColor: SECONDARY_COLOR,
      color: 'white',
    },
    '.MuiPickersBasePicker-container .MuiPickersDay-dayDisabled': {
      color: 'rgba(0, 0, 0, 0.38)', 
    },
    '.MuiPickersModal-dialogRoot .MuiButton-textPrimary': {
      color: SECONDARY_COLOR,
    },

    'h5': {
      color: PRIMARY_COLOR,
      fontSize: '1.1rem !important',
    },

    '.MuiIcon-root': {
      fontSize: 'inherit',
    },
    
    '.noScrollBar::-webkit-scrollbar': {
      display: 'none'
    }
  },
})(() => null);

function App() {
  const [restaurantData, setRestaurantData] = useState({});
  const [restaurantSetup, setRestaurantSetup] = useState({});
  const [currentPath, setCurrentPath] = useState('/');
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [timeRanges, setTimeRanges] = useState(null);
  const [timeRangesLoading, setTimeRangesLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(false);
  const [windowCloseError, setWindowCloseError] = useState(false);

  const { 
    micrositeId,
    language,
    __bb_platform,
  } = getSearchParams();

  useEffect(() => {
    async function fetchRestaurantData() {
      if (micrositeId) {
        const resp = await RestaurantAPI.getRestaurant({ micrositeId, language })
        setRestaurantData(resp.data);
      }
    }
    async function fetchRestaurantSetup() {
      if (micrositeId) {
        const resp = await RestaurantAPI.getOnlineBookingSetup({ micrositeId, language })
        const data = resp.data;
        const { bookingReasons, minOnlinePartySize } = data;
        console.log(bookingReasons)
        setRestaurantSetup(data);
        setFormData(formData => ({...formData, partySize: minOnlinePartySize, visitTime: '', bookingReasons}));
      }
    }
    fetchRestaurantData();
    fetchRestaurantSetup();
  }, [micrositeId, language])
  useEffect(() => {
    console.log(getSearchParams())
    async function fetchData() {
      setTimeRanges(null);
      setTimeRangesLoading(true);
      setFormData(formData => ({...formData, visitTime: ''}));

      const resp = await RestaurantAPI.getRestaurantAvailability({ 
        micrositeId,
        partySize: formData.partySize,
        visitDate: _format(formData.visitDate, 'yyyy-MM-dd'),
        language,
      });

      setTimeRanges(resp.data || []);
      setTimeRangesLoading(false);
    }
    fetchData();
  }, [micrositeId, language, formData.visitDate, formData.partySize])
  useEffect(() => {
    setupMiniprogramSDK();
  }, [])

  const navigate = (path) => {
    setCurrentPath(path)
    window.scrollTo(0, 0)
  }

  const locale = language || 'en-US'

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
    <div className="App">
      <GlobalCss />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={dateFnsLocales[locale]}>
        <div style={{ margin: '0px 24px' }}>
        {/* {getCurrentEnvironment() === 'miniprogram' || __bb_platform == 'miniprogram' ? <Header
          onBackButtonClick={
            currentPath === '/'
            ? undefined
            : window.close
          }
        >
          <Typography variant="h6" style={{ textAlign: 'center', userSelect: 'none' }}>Restaurant Booking</Typography>
        </Header>
        : <></>} */}
        {AppContext && <AppContext.Provider value={{
          currentPath,
          setCurrentPath: navigate,
          restaurantData,
          restaurantSetup,
          formData,
          setFormData,
          timeRanges,
          timeRangesLoading,
          bookingLoading,
          setBookingLoading,
          bookingError,
          setBookingError,
          windowCloseError,
          setWindowCloseError,
        }}>
          {currentPath === '/' && <HomePage />}
          {currentPath === '/form' && <BookingForm />}
          {currentPath === '/complete' && <BookingComplete />}
        </AppContext.Provider>}
        </div>
      </MuiPickersUtilsProvider>
    </div>
    </IntlProvider>
  );
}

export default App;
