import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import BackFillDefault from 'components/Icons/BackFillDefault';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    cursor: 'pointer',
    margin: 20,
  },
  navigateBefore: {
    border: `1px ${theme.palette.primary.main} solid`,
  },
}))

const PrevDefaultButton = ({ onClick, className }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.iconContainer, className)} onClick={onClick}> 
      <BackFillDefault /> 
    </div>
  )
}

export default PrevDefaultButton;
