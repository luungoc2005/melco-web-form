import axios from 'axios';
import { stringify, parse } from 'querystring';

const MELCO_SERVICE_API_URL = 'https://restaurant.dev.melco-dxeng.com'
const MELCO_APP_API_URL = 'https://melcoapp-dev.melcoclub.cn'
const BOTBOT_API_URL = 'https://melcomanilatesting.azurewebsites.net'

export const getSearchParams = () => parse(window.location.search.substring(1))

export const RestaurantAPI = {
  getRestaurant: ({ micrositeId }) => axios.get(`${BOTBOT_API_URL}/api/restaurant/${micrositeId}/content`),
  getOnlineBookingSetup: ({ micrositeId }) => axios.get(`${BOTBOT_API_URL}/api/restaurant/${micrositeId}/setup`),
  getRestaurantAvailability: ({ micrositeId, partySize, visitDate }) => 
    axios.get(`${MELCO_SERVICE_API_URL}/v1/restaurants/${micrositeId}/availabilitySearch?${stringify({ partySize, visitDate })}`),
  bookRestaurant: ({ params, data }) => 
    axios.post(`${BOTBOT_API_URL}/api/resBooking/booking?${stringify(params)}`, data)
}

export default RestaurantAPI;