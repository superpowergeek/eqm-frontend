import React from 'react';
import Typography from '@material-ui/core/Typography';
import FlexDiv from 'components/shared/FlexDiv';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import BearIcon from 'components/Icons/BigBear';

const useStyles = makeStyles(theme => ({
  btn: {
    height: 40,
    color: 'white',
    fontSize: '1rem',
    textTransform: 'unset',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
    marginTop: 24,
    paddingLeft: 48,
    paddingRight: 48
  },
  bearIcon: {
    position: 'absolute',
    left: 0,
    bottom: -44
  }
}))

const FirstChart = ({ onClick }) => {
  const classes = useStyles();
  return (
    <FlexDiv fullHeight fullWidth column container mainAlign="center" crossAlign="center" style={{position: 'relative'}}>
      <Typography variant="h4" color="primary">
        Go start your first chart !
      </Typography>
      <Typography variant="body1" style={{color: '#757575', marginTop: 8}}>
        Create a chart, start to do something for our planet.
      </Typography>
      <Button variant="contained" onClick={onClick} className={classes.btn}>Create a chart</Button>
      <div className={classes.bearIcon}>
        <BearIcon />
      </div>
    </FlexDiv>
  )
}

export default FirstChart;