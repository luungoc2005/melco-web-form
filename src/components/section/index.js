import React from 'react';

import Typography from '@material-ui/core/Typography';

export const Section = ({ title, children, style = {}, className, underline = false }) => {
  return (<>
  <div style={{ marginTop: 20, marginBottom: 5 }}>
    <Typography variant="h5">
      {title}
    </Typography>
    <div 
      style={{ 
        minHeight: 20,
        marginTop: 12,
        paddingBottom: 20,
        ...style 
      }}
      className={className}
    >
      {children}
    </div>
  </div>
  {underline && <div style={{ borderBottom: '1px solid #ddd' }} />}
  </>)
}

export default Section;