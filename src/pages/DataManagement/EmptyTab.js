import React from 'react';
import Typography from '@material-ui/core/Typography';
import FlexDiv from 'components/shared/FlexDiv';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import BearIcon from 'components/Icons/Bear';

const useStyles = makeStyles(theme => ({
  root: {
    height: 800
  },
  btn: {
    height: 40,
    color: 'white',
    fontSize: '1rem',
    textTransform: 'unset',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    }
  },
  btnContainer: {
    marginTop: 24,
    marginRight: 24
  }
}))

const EmptyTab = ({ onClick }) => {
  const classes = useStyles();
  return (
    <FlexDiv fullHeight fullWidth column container >
      <FlexDiv crossAlign="end" className={classes.btnContainer}>
        <FlexDiv item grow />
        <Button variant="contained" onClick={onClick} className={classes.btn}>Add Asset Group</Button>
      </FlexDiv>
      <FlexDiv column mainAlign="center" crossAlign="center" className={classes.root}>
        <div className={classes.bearIcon}>
          <BearIcon style={{ fontSize: 200 }} />
        </div>
        <Typography variant="h5" style={{color: '#757575'}}>
          It's cold as North Pole in here!
        </Typography>
        <Typography variant="h5" style={{color: '#757575'}}>
          There's no data yet, start adding now!
        </Typography>
        <Typography variant="body1" style={{color: '#ef5423', marginTop: 32}}>
          Use the button on the top-right corner
        </Typography>
      </FlexDiv>
      
    </FlexDiv>
  )
}

export default EmptyTab;