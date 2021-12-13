import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import NavigateBeforeRounded from '@material-ui/icons/NavigateBeforeRounded';
import WhiteBear from 'components/Icons/WhiteBear';
import FlexDiv from './FlexDiv';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    width: 60,
    height: 100,
    position: 'fixed',
    right: 20,
    bottom: 0
  },
  innerContainer: {
    backgroundColor: '#ef5423',
    width: 60,
    height: 60,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    border: '1px solid white',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  bear: {
    position: 'absolute',
    left: 3,
    top: 13
  },
  barContainer: {
    width: 60,
    height: 40,
  },
  bar: {
    backgroundColor: '#ef5423',
    width: 4,
    height: 40,
    margin: 'auto'
  }
  
}))

const HelpIconButton = ({ onClick, className }) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.mainContainer, className)}>
      <div className={classes.innerContainer} onClick={onClick}>
        <div className={classes.iconContainer} >
          <div className={ classes.bear } >
           <WhiteBear />
          </div>
        </div>
      </div>
      <div className={classes.barContainer}>
        <div className={classes.bar}>

        </div>
      </div>
    </div>
  )
}

export default HelpIconButton;
