import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { push, goBack } from 'connected-react-router';
import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import EqmLogo from 'components/Icons/EqmLogo';
import { onInputChange } from 'utils/functions';
import { useWidth } from 'utils/hooks';
import Background from 'components/Icons/Background';
import PrevOutlinedButton from 'components/shared/PrevOutlinedButton';
import types from '@constants/actions';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 48,
  },
  formContainer: {
    
  },
  formTitle: {
    marginTop: 24,
    alignSelf: 'center',
    textAlign: 'center'
  },
  input: {
    marginTop: 8, 
    height: 40,
  },
  formInput: {
    marginBottom: '40px!important'
  },
  link: {
    color: '#ef5423',
    fontFamily: 'HelveticaNeue'
  },
  btn: {
    marginTop: 48,
    textTransform: 'none',
    height: 44,
    width: 360,
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
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
  },
  prevBtn: {
    marginLeft: 28
  }
}));

const emptyValidater = (value) => {
  // const reg = '';
  // reg.test(value);
  return !!value;
}

const ForgotPassword = (props) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);

  const dispatch = useDispatch();
  const onSubmit = e => {
    e.preventDefault();
    if (isEmailError) return;
    dispatch({
      type: types.FORGOT_PASSWORD,
      data: {
        email
      }
    });
    dispatch(push('/forgot-password-success'));
  }

  const onClickRegist = e => { 
    e.preventDefault();
    dispatch(push('/register'));
  }

  const onHandleBlur = validater => setIsError => (e) => {
    const { value } = e.target;
    if (!validater(value)) return setIsError(true);
  }

  const onHandleFocus = setIsError => (e) => {
    setIsError(false);
  }

  const onPrevpage = () => dispatch(goBack());

  const width = useWidth();

  return (
    <Grid container direction="row" justify="center" onScroll={e => { console.log(e); e.preventDefault(); }}>
      <Grid item xs={12} sm={8} md={8} lg={8} xl={8} className={classes.root}>
        <FlexDiv className={classes.prevBtn}>
          <PrevOutlinedButton onClick={onPrevpage} />
        </FlexDiv>
        <FlexDiv item column crossAlign="center" className={classes.formContainer}>
          <FlexDiv item column style={{ marginBottom: 24 }}>
            <EqmLogo style={{ width: 120, height: 60, alignSelf: 'center' }}/>
            <Typography variant="h4" className={classes.formTitle}>Forgot your password?</Typography>
            <Typography className={classes.formTitle}>Please click the Link in your email to verify your<br/>account and start enjoying EQM platform.</Typography>
          </FlexDiv>
          <FormInput
            label="Your account"
            required
            error={isEmailError}
            helperText={isEmailError ? "Please Check Your Account" : undefined}
            classes={{ container:classes.formInput }}
            >
            <OutlinedInput
              value={email}
              error={isEmailError}
              placeholder={"email@sample.com"}
              onChange={onInputChange(setEmail)}
              className={classes.input}
              onBlur={onHandleBlur(emptyValidater)(setIsEmailError)}
              onFocus={onHandleFocus(setIsEmailError)}
            />
          </FormInput>
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            className={classes.btn}
          >
            Reset Password
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

export default ForgotPassword;