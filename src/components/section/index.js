import React from 'react';

import Typography from '@material-ui/core/Typography';

export const Section = ({ title, children, style = {}, underline = false }) => {
  return (<>
  <div style={{ margin: '20px 0' }}>
    <Typography variant="h5">
      {title}
    </Typography>
    <div style={{ 
      minHeight: 20,
      marginTop: 12,
      ...style }}>
      {children}
    </div>
  </div>
  {underline && <div style={{ borderBottom: '1px solid #ddd' }} />}
  </>)
}

export default Section;