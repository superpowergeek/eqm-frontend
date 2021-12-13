import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { replace } from 'connected-react-router';
import FlexDiv from 'components/shared/FlexDiv';
import EqmLogo from 'components/Icons/EqmLogo';
import UserDropDown from 'containers/UserDropDown';
import * as Selectors from 'selectors';
import Notifications from '@material-ui/icons/Notifications';
import Settings from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
  },
  toolBar: {
    height: 60,
    minHeight: 60,
    paddingLeft: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  test: {
    height: '100%',
  },
  btn: {
    height: 60,
    textTransform: 'none',
    fontSize: 14,
    fontWeight:300,
    padding: 8,
    paddingLeft: 24,
    paddingRight: 24,
    boxSizing: 'border-box',
    borderRadius: 'unset',
    '&:hover': {
      backgroundColor: fade('rgb(74, 75, 76)', 0.7),
      color: theme.palette.secondary.main,
    },
    '&:active': {
      color: fade(theme.palette.text.primary, 0.5),
    },
  },
  active: {
    backgroundColor: 'rgb(74, 75, 76)',
    color: theme.palette.secondary.main,
  },
}))

const AppBar = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onClickLogin = () => dispatch(replace('/login'));
  const isAuthenticated = useSelector(Selectors.selectUserIsAuthenticated);
  const currentPath = useSelector(Selectors.selectPathName);
  return (
    <MuiAppBar position="static" elevation={0} color="primary" className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <EqmLogo style={{ width: 120, height: 48 }} />
        <Button color="inherit" className={clsx(classes.btn, { [classes.active]: currentPath === '/dashboard' })} onClick={() => dispatch(replace('/dashboard'))}>Dashboard</Button>
        <Button color="inherit" className={clsx(classes.btn, { [classes.active]: currentPath.includes('/analytics') })} onClick={() => dispatch(replace('/analytics'))}>Analytics</Button>
        <Button color="inherit" className={clsx(classes.btn, { [classes.active]: currentPath.includes('/reports') })} onClick={() => dispatch(replace('/reports'))}>Reports</Button>
        <Button color="inherit" className={clsx(classes.btn, { [classes.active]: currentPath.includes('/data-management') })} onClick={() => dispatch(replace('/data-management'))}>Manage Data</Button>
        <Button color="inherit" className={clsx(classes.btn, { [classes.active]: currentPath.includes('/SDG') })} onClick={() => dispatch(replace('/SDG'))}>SDG</Button>
        <Button color="inherit" className={clsx(classes.btn, { [classes.active]: currentPath.includes('/accounts') })} onClick={() => dispatch(replace('/accounts'))}>Accounts</Button>
        <FlexDiv item grow/>
        <IconButton color="inherit">
          <Notifications />
        </IconButton>
        <IconButton color="inherit">
          <Settings />
        </IconButton>
        {isAuthenticated
          ? <UserDropDown />
          : <Button color="inherit" disableRipple className={classes.btn} onClick={onClickLogin}>Login</Button>}
      </Toolbar>
    </MuiAppBar>
  )
}

export default AppBar;
