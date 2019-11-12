import React from 'react';

import { PRIMARY_COLOR, SECONDARY_COLOR } from '../../App';

import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

export const RestaurantBanner = ({ restaurantData }) => {
  const { property, addressShort, phone, images } = restaurantData;
  return (<>
  <div style={{ display: 'flex', marginBottom: 12 }} >
    <div style={{ flex: 3 }}>
      <Typography variant="h5" style={{ marginBottom: 24 }}>
        {property}
      </Typography>
      {addressShort && <div style={{ marginBottom: 6 }}>
        <Typography variant="body2">
          <Icon style={{ color: SECONDARY_COLOR, marginRight: 12 }}>map</Icon>
          {addressShort}
        </Typography>
      </div>}
      {phone && <div style={{ color: SECONDARY_COLOR, }}>
        <Typography variant="body2">
          <Icon style={{ marginRight: 12 }}>call</Icon>
          {phone}
        </Typography>
      </div>}
    </div>
    <div style={{ flex: 1, overflow: 'hidden' }}>
      {images && <img src={images[0]} alt={property} style={{ 
        width: '100%',
        height: '100%',
        objectFit: 'cover' 
      }} />}
    </div>
  </div>
  <div style={{ borderBottom: '1px solid #ddd' }} />
  </>)
}

export default RestaurantBanner;