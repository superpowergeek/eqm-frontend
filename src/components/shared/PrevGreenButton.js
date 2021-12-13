import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeRounded from '@material-ui/icons/NavigateBeforeRounded';
import BackFillGreen from 'components/Icons/BackFillGreen';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    paddingTop: 8
  },
}))

const PrevGreenButton = ({ onClick, className }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.iconContainer, className)} onClick={onClick}> 
      <BackFillGreen /> 
    </div>
  )
}

export default PrevGreenButton;
