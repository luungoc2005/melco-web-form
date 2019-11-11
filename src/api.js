import axios from 'axios';
import { stringify, parse } from 'querystring';

const MELCO_SERVICE_API_URL = 'https://restaurant.dev.melco-dxeng.com'
const MELCO_APP_API_URL = 'https://melcoapp-dev.melcoclub.cn'
const BOTBOT_API_URL = 'http://melcomanilatesting.azurewebsites.net'

export const getSearchParams = () => parse(window.location.search.substring(1))

export const RestaurantAPI = {
  getRestaurant: ({ micrositeId }) => axios.get(`${MELCO_APP_API_URL}/content/v1/restaurants/${micrositeId}`),
  getOnlineBookingSetup: ({ micrositeId }) => axios.get(`${MELCO_SERVICE_API_URL}/v1/restaurants/${micrositeId}/setup`, {
    headers: {
      'Accept-Language': 'en-US'
    }
  }),
  getRestaurantAvailability: ({ micrositeId, partySize, visitDate }) => 
    axios.get(`${MELCO_SERVICE_API_URL}/v1/restaurants/${micrositeId}/availabilitySearch?${stringify({ partySize, visitDate })}`),
  bookRestaurant: ({ channelId, channelUserId, data }) => 
    axios.post(`${BOTBOT_API_URL}/api/resBooking/booking?${stringify({ channelId, channelUserId })}`, data)
}

export default RestaurantAPI;