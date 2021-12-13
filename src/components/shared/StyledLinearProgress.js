import React from 'react';
import { makeStyles } from '@material-ui/core';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  progressRoot: props => ({
    height: props.height || 20,
    width: '100%',
    backgroundColor: props.color ? lighten(props.color, 0.7) : theme.palette.common.white,
    borderRadius: props.borderRadius || 4,
  }),
  barColorPrimary: props => ({
    height: props.height || 20,
    backgroundColor: props.color ? props.color : theme.palette.primary.main,
    borderRadius: props.borderRadius || 4,
  }),
}))

const StyledLinearProgress = React.forwardRef((props, ref) => {
  const classes = useStyles(props);
  const { color, height, borderRadius, classes: parentClasses = {}, value, ...others } = props;
  return (
    <LinearProgress
      ref={ref}
      className={clsx(classes.progressRoot, parentClasses.progressRoot)} 
      classes={{
        barColorPrimary: clsx(
          classes.barColorPrimary,
          parentClasses.barColorPrimary
        )}}
      variant="determinate" 
      value={value}
      {...others}
    />
  )
})

export default StyledLinearProgress;
