import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
// import MenuIcon from '@material-ui/icons/Menu';
import FlexDiv from '../components/shared/FlexDiv';
import * as Selectors from '../selectors';
import types from '@constants/actions';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  account: {
    paddingLeft: 16,
    paddingRight: 16,
    textTransform: 'none',
  },
  btn: {

  },
  memu: {
    width: 200,
  }
}))

const UserDropDown = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userName = useSelector(Selectors.selectUserName);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onClickLogout = () => {
    handleClose();
    dispatch({ type: types.CLEAR_SESSION_CACHE });
    dispatch({ type: types.CLEAR_ERROR_RESPONSE });
  }
  return (
    <FlexDiv item>
      <Button color="inherit" className={classes.btn} onClick={handleClick}>
        <Avatar />
        <Typography variant="subtitle1" color="inherit" className={classes.account}>{userName}</Typography>
        <ExpandMore />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: classes.memu }}
        getContentAnchorEl={null}
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Help Center</MenuItem> */}
        <MenuItem onClick={onClickLogout}>Sign Out</MenuItem>
      </Menu>
    </FlexDiv>
  )
}

export default UserDropDown;
