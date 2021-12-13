import React from 'react';
import FlexDiv from 'components/shared/FlexDiv';
import { Chip } from '@nivo/tooltip'
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {

  },
}));

const Legend = (props) => {
  const classes = useStyles();
  return (
    <FlexDiv className={classes.root} wrap="wrap">
      
    </FlexDiv>
  );
}

export default Legend;
