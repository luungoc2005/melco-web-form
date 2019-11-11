import React, { useContext } from 'react';

import { AppContext } from '../../context';
import { RestaurantBanner } from '../../components/restaurant_banner';
import { Section } from '../../components/section';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

import MuiPhoneNumber from 'material-ui-phone-number';

const useStyles = makeStyles(theme => ({
  buttonNoTransform: {
    textTransform: 'none',
    label: {
      display: 'flex',
    }
  }
})) 

export const BookingForm = () => {
  const classes = useStyles();
  const { restaurantData, restaurantSetup, formData, setFormData } = useContext(AppContext) || {};
  const { bookingReasons } = formData;
  console.log(formData)

  return (
    <>
      <RestaurantBanner restaurantData={restaurantData} />
      
      <Section title='Contact Information'>
        <ToggleButtonGroup
          value={formData.title}
          exclusive
          onChange={(event, value) => setFormData({...formData, title: value})}
          aria-label="title"
          style={{ width: '100%', alignItems: 'stretch' }}
        >
          {['Mr.', 'Ms.', 'Mrs.'].map((value) => <ToggleButton
            key={value}
            value={value}
            className={classes.buttonNoTransform}
            style={{ flex: 1 }}
          >
            {value}
          </ToggleButton>)}
        </ToggleButtonGroup>

        <TextField
          required
          fullWidth
          label="First Name"
          placeholder="Enter your first name"
          margin="normal"
          value={formData.firstName}
          onChange={(event) => setFormData({...formData, firstName: event.target.value})}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          required
          fullWidth
          label="Last Name"
          placeholder="Enter your last name"
          margin="normal"
          value={formData.lastName}
          onChange={(event) => setFormData({...formData, lastName: event.target.value})}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <MuiPhoneNumber 
          required
          label='Phone Number'
          defaultCountry={'sg'}
          fullWidth
          margin="normal"
          onChange={(value) => setFormData({...formData, phoneNumber: value})}
          value={formData.phoneNumber}
        />

        <TextField
          required
          fullWidth
          label="Email"
          placeholder="Enter an email address"
          margin="normal"
          value={formData.email}
          inputProps={{
            type: 'email'
          }}
          onChange={(event) => setFormData({...formData, email: event.target.value})}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Section>

      <Section title='Special Requests'>
        <TextField
          required
          fullWidth
          placeholder="Please enter special requests"
          margin="normal"
          value={formData.specialRequests}
          onChange={(event) => setFormData({...formData, specialRequests: event.target.value})}
        /> 
      </Section>

      <Section title='Special Occasions'>
        {bookingReasons && bookingReasons.map((value) => <Chip
          key={value.id}
          label={value.name}
          onClick={() => setFormData({
            ...formData, 
            bookingReasons: bookingReasons.map(
              item => item.id === value.id ? {...value, checked: !value.checked} : item
            )
          })}
          variant={value.checked ? 'default' : 'outlined'}
          style={{ marginRight: 20 }}
        />)}
      </Section>

      <Button
        color="primary"
        fullWidth
        variant="contained"
      >
        Book
      </Button>
      
    </>
  )
}

export default BookingForm