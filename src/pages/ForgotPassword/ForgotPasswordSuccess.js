import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { push } from 'connected-react-router';
import FlexDiv from 'components/shared/FlexDiv';
import { useWidth } from 'utils/hooks';
import Background from 'components/Icons/Background';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 48,
  },
  formContainer: {
    height: '100%'
  },
  formTitle: {
    marginTop: 24,
    alignSelf: 'center',
    textAlign: 'center'
  },
  btn: {
    marginTop: 48,
    textTransform: 'none',
    height: 44,
    width: 360,
    backgroundColor: '#4db6ac',
    '&:hover': {
      backgroundColor: '#4db6ac',
    },
  },
  errorMsg: {
    color: theme.palette.error.main,
  },
  signUpContainer: {
    width: '33.33%',
    position: 'absolute',
    top: '50%',
    textAlign: 'center'
  },
  btnSignUp: { 
    marginBottom: 0,
    color: '#333333', 
    textTransform: 'unset',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
    width: '70%',
    height: 44
  },
  balance: {
    color: 'white',
    marginTop: 24
  }
}));

const FogotPasswordSuccess = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const onSubmit = e => {
    e.preventDefault();
    dispatch(push('/login'));
  }

  const onClickRegist = e => { 
    e.preventDefault();
    dispatch(push('/register'));
  }
  const width = useWidth();

  return (
    <Grid container direction="row" justify="center" onScroll={e => { console.log(e); e.preventDefault(); }}>
      <Grid item xs={12} sm={8} md={8} lg={8} xl={8} className={classes.root}>
        <FlexDiv item column crossAlign="center" mainAlign="center" className={classes.formContainer}>
          <FlexDiv item column style={{ marginBottom: 24 }}>
            <Typography variant="h4" className={classes.formTitle}>Password reset email<br/>sent</Typography>
            <Typography className={classes.formTitle}>An email has sent to your email address, follow the<br/>directions in the email to reset your password.</Typography>
          </FlexDiv>
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            className={classes.btn}
          >
            OK
          </Button>
        </FlexDiv>
      </Grid>
      {width !== 'xs' && <Grid item xs={12} sm={4} md={4} lg={4} xl={4} style={{ height: '100vh' }}>
          <Background />
          <div className={classes.signUpContainer}>
            <Button onClick={onClickRegist} className={classes.btnSignUp}>Sign Up</Button>
            <Typography variant="h4" className={classes.balance}>Balance Our Planet</Typography>
          </div>
      </Grid>}
    </Grid>
  )
}

export default FogotPasswordSuccess;