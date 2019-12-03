import React, { useContext } from 'react';

import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../App';

import { AppContext } from '../../context';
import { RestaurantBanner } from '../../components/restaurant_banner';
import { Section } from '../../components/section';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import MuiPhoneNumber from 'material-ui-phone-number';

import _format from 'date-fns/format';

import { formatTime } from '../../utils';

import { useIntl, FormattedMessage, FormattedPlural } from 'react-intl';
import { dateFnsLocales } from '../../intl';

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
  const { 
    restaurantData, 
    formData, 
    setFormData,
    setCurrentPath,
  } = useContext(AppContext) || {};
  const intl = useIntl();
  const { bookingReasons } = formData;

  const handleSubmit = () => {
    setCurrentPath('/complete');
  }

  return (
    <>
      <RestaurantBanner restaurantData={restaurantData} />

      <Section 
        title={intl.formatMessage({ 
          id: 'booking.section_details.title',
          defaultMessage: 'Booking Details' ,
        })}
        style={{ width: '100%', display: 'flex', alignItems: 'stretch' }}
        underline={true}
      >
        <div style={{ flex: 1 }}>
          <Typography variant="body2">
            <Icon style={{ color: SECONDARY_COLOR, marginRight: 12 }}>calendar_today</Icon>
            {_format(formData.visitDate, intl.formatMessage({ 
              id: 'home.section_details.visit_date_format',
              defaultMessage: 'd MMM (iii)',
            }), {
              locale: dateFnsLocales[intl.locale]
            })}
          </Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="body2">
            <Icon style={{ color: SECONDARY_COLOR, marginRight: 12 }}>access_time</Icon>
            {formatTime(formData.visitTime, intl)}
          </Typography>
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="body2">
            <Icon style={{ color: SECONDARY_COLOR, marginRight: 12 }}>person</Icon>
            <FormattedMessage
              id='home.section_details.guests_count_format'
              defaultMessage='{num_guests, plural,
                =0 {no guest}
                one {# guest}
                other {# guests}
              }'
              values={{
                num_guests: formData.partySize,
              }}
            />
          </Typography>
        </div> 
      </Section>

      <Section title={intl.formatMessage({ 
          id: 'booking.section_contact_information.title',
          defaultMessage: 'Contact Information' ,
        })}>
        <ToggleButtonGroup
          value={formData.title}
          exclusive
          onChange={(event, value) => value && setFormData({...formData, title: value})}
          aria-label="title"
          style={{ width: '100%', alignItems: 'stretch' }}
        >
          {[
            intl.formatMessage({ 
              id: 'booking.section_contact_information.name_title_mr',
              defaultMessage: 'Mr.',
            }), 
            intl.formatMessage({ 
              id: 'booking.section_contact_information.name_title_ms',
              defaultMessage: 'Ms.',
            }), 
            intl.formatMessage({ 
              id: 'booking.section_contact_information.name_title_mrs',
              defaultMessage: 'Mrs.',
            })
          ].map((value) => <ToggleButton
            key={value}
            value={value}
            className={classes.buttonNoTransform}
            style={{ flex: 1 }}
            variant="outlined"
          >
            {value}
          </ToggleButton>)}
        </ToggleButtonGroup>

        <TextField
          required
          fullWidth
          label={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_first_name',
            defaultMessage: "First Name",
          })}
          placeholder={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_first_name_placeholder',
            defaultMessage: "Enter your first name",
          })}
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
          label={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_last_name',
            defaultMessage: "Last Name",
          })}
          placeholder={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_last_name_placeholder',
            defaultMessage: "Enter your last name",
          })}
          margin="normal"
          value={formData.lastName}
          onChange={(event) => setFormData({...formData, lastName: event.target.value})}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <MuiPhoneNumber 
          required
          label={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_phone_number',
            defaultMessage: 'Phone Number',
          })}
          defaultCountry={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_phone_number_default_country',
            defaultMessage: 'sg',
          })}
          fullWidth
          margin="normal"
          onChange={(phoneNumber, country) => setFormData({...formData, country, phoneNumber})}
          value={formData.phoneNumber}
        />

        <TextField
          required
          fullWidth
          label={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_email',
            defaultMessage: "Email",
          })}
          placeholder={intl.formatMessage({ 
            id: 'booking.section_contact_information.input_email_placeholder',
            defaultMessage: "Enter an email address",
          })}
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

      <Section title={intl.formatMessage({ 
          id: 'booking.section_special_requests.title',
          defaultMessage: 'Special Requests',
        })}>
        <TextField
          required
          fullWidth
          placeholder={intl.formatMessage({ 
            id: 'booking.section_special_requests.input_special_requests',
            defaultMessage: "Please enter special requests",
          })}
          margin="normal"
          value={formData.specialRequests}
          onChange={(event) => setFormData({...formData, specialRequests: event.target.value})}
        /> 
      </Section>

      <Section title={intl.formatMessage({ 
          id: 'booking.section_special_occasions.title',
          defaultMessage: 'Special Occasions',
        })}>
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

      <div style={{ display: 'flex' }}>
        <Button
          color="secondary"
          onClick={() => setCurrentPath('/')}
          style={{ flex: 0, marginRight: 12 }}
        >
          <Icon>navigate_before</Icon>
          <FormattedMessage 
            id="common.buttons.back"
            defaultMessage="Back"
          />
        </Button>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          disabled={
            formData.firstName.trim() === '' ||
            formData.lastName.trim() === '' ||
            formData.phoneNumber.trim() === '' ||
            formData.email.trim() === ''
          }
          onClick={handleSubmit}
          style={{ flex: 1 }}
        >
          <FormattedMessage 
            id="common.buttons.book"
            defaultMessage="Book"
          />
        </Button>
      </div>
    </>
  )
}

export default BookingForm