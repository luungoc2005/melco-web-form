import React from 'react';

import AutoScale from 'react-auto-scale';
import Typography from '@material-ui/core/Typography';

export const RestaurantBanner = ({ restaurantData }) => {
  const { property, addressShort, phone, images } = restaurantData;
  return (<div>
    <div>
      <Typography variant="h5">
        {property}
      </Typography>
      <div>
        <span>{addressShort}</span>
      </div>
      <div>
        <span>{phone}</span>
      </div>
    </div>
    <div>
      {images && <AutoScale>
        <img src={images[0]} alt={property} />
      </AutoScale>}
    </div>
  </div>)
}

export default RestaurantBanner;