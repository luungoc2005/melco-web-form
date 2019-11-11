import React from 'react';

import Typography from '@material-ui/core/Typography';

export const Section = ({ title, children, style = {} }) => {
  return (<div style={{ margin: '20px 0' }}>
    <Typography variant="h5">
      {title}
    </Typography>
    <div style={{ minHeight: 20, ...style }}>
      {children}
    </div>
  </div>)
}

export default Section;