import React from 'react'

import { SECONDARY_COLOR, PRIMARY_COLOR } from '../../App';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 24,
  },
}));

export const Header = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" elevation={0} style={{ padding: 12 }}>
        <Toolbar variant="dense">
          <div style={{ flex: 1 }}>
            {children}
          </div>

          <IconButton
            edge="end"
            aria-label="close"
            aria-haspopup="true"
            onClick={() => window.close()}
            style={{ flex: 0 }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ borderBottom: '1px solid #ddd' }} />
    </div>
  )
}

export default Header