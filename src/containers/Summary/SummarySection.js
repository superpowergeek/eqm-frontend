import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import FlexDiv from 'components/shared/FlexDiv';

const useStyles = makeStyles((theme) => ({
  h5: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.1rem',
    },
  }
}))

const SummarySection = (props) => {
  const {
    title = "This Is A Section Title For Chart",
    children,
  } = props;
  const classes = useStyles();
  return (
    <FlexDiv container fullHeight fullWidth column>
      <FlexDiv container fullWidth>
        <Typography variant="h5" className={classes.h5} color="primary">{title}</Typography>
        <FlexDiv item grow />
      </FlexDiv>
      {children}
    </FlexDiv>
  )
};

export default SummarySection;
