import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    textTransform: 'none',
    borderRadius: 24,
    minWidth: 80,
    minHeight: 32,
    // TODO: change interact color
    '&:active': {
      backgroundColor: fade(theme.palette.text.primary, 0.5),
    },
  },
  isCheck: {
    '&:hover': {
      backgroundColor: fade(theme.palette.text.primary, 0.7),
    },
    backgroundColor: fade(theme.palette.text.primary, 0.6),
  }
}))

const OptionButton = (props) => {
  const { className, classes: overrideClasses, onClick, checked, ...others } = props;
  const classes = useStyles();
  const handleOnClick = (e) => {
    if (onClick) onClick(e);
  }
  return (
    <Button
      variant="contained"
      disableElevation
      className={clsx(classes.root, className, { [classes.isCheck]: checked })}
      classes={overrideClasses}
      onClick={handleOnClick}
      {...others}
    />
  )
}

export default OptionButton