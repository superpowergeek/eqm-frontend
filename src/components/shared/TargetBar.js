import React from 'react';
import { makeStyles, lighten } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  progressRoot: {
    height: 10,
    width: '100%',
    backgroundColor: lighten(theme.palette.success.light, 0.8),
  },
  progressFilledRoot: {
    height: 10,
    backgroundColor: theme.palette.success.main,
  },
  warnRoot: {
    height: 10,
    backgroundColor: lighten('#f6d743', 0.6),
  },
  warnFilled: {
    height: 10,
    backgroundColor: '#f6d743',
  },
}))

const TargetBar = React.forwardRef((props, ref) => {
  const { value } = props;
  const classes = useStyles();
  return (
    <LinearProgress
      ref={ref}
      className={clsx(classes.progressRoot, { [classes.warnRoot]: value > 75 })} 
      classes={{
        barColorPrimary: clsx(
          classes.progressFilledRoot, 
          { [classes.warnFilled]: value > 75}) 
        }}
      variant="determinate" 
      value={value}
    />
  )
});

export default TargetBar;
