import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import BackOutlined from 'components/Icons/BackOutLined';

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    margin: 20,
  }
}))

const PrevDefaultButton = ({ onClick, className }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.iconContainer, className)} onClick={onClick}> 
      <BackOutlined /> 
    </div>
  )
}

export default PrevDefaultButton;
