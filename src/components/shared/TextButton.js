import React from "react"
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    padding: 0,
    textTransform: 'none',
    fontWeight: 'bold',
    lineHeight: 1,
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
    '&:active': {
      color: fade(theme.palette.text.primary, 0.5),
    },
  },
  
}))

const TextButton = props => {
  const { className, classes: overrideClasses, ...others } = props;
  const classes = useStyles();
  return (
    <Button
      className={clsx(classes.root, className)}
      classes={overrideClasses}
      disableRipple
      {...others}
    />
  )
}

export default TextButton;