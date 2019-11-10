import React from 'react';

import Typography from '@material-ui/core/Typography';

export const Section = ({ title, children }) => {
  return (<>
    <Typography variant="h5">
      {title}
    </Typography>
    <div style={{ minHeight: 20 }}>
      {children}
    </div>
  </>)
}

export default Section;