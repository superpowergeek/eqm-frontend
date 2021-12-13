import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeRounded from '@material-ui/icons/NavigateBeforeRounded';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    margin: 20,
  },
  navigateBefore: {
    border: `1px ${theme.palette.primary.main} solid`,
  },
}))

const PrevIconButton = ({ onClick, className }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.iconContainer, className)}>
      <IconButton className={classes.navigateBefore} size="small" onClick={onClick}>
        <NavigateBeforeRounded />
      </IconButton>
    </div>
  )
}

export default PrevIconButton;
