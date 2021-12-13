import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import { push, goBack } from 'connected-react-router';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import EqmLogo from 'components/Icons/EqmLogo';
import { useWidth } from 'utils/hooks';
import Background from 'components/Icons/Background';
import PrevOutlinedButton from 'components/shared/PrevOutlinedButton';
import types from '@constants/actions';
import { onInputChange, onInputBlur, onInputFocus } from 'utils/functions';
import { isValidPassword } from 'utils/validators';

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
  balance: {
    color: 'white',
    marginTop: 24
  },
  prevBtn: {
    marginLeft: 28
  }
}));

const ResetPassword = (props) => { 
  const query = new URLSearchParams(props.location.search);
  const token = query.get('token');
  const classes = useStyles();
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [isPwdError, setIsPwdError] = useState(false);
  const [isPwdAgainError, setIsPwdAgainError] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdAgain, setShowPwdAgain] = useState(false);

  const dispatch = useDispatch();
  const handleClickShowPassword = useCallback(() => setShowPwd(preValue => !preValue), []);
  const handleMouseDownPassword = useCallback(() => (event) => event.preventDefault(), []);
  const handleClickShowPasswordAgain = useCallback(() => setShowPwdAgain(preValue => !preValue), []);
  const handleMouseDownPasswordAgain = useCallback(() => (event) => event.preventDefault(), []);

  const onSubmit = e => {
    e.preventDefault();
    if (password === '') return setIsPwdError(true);
    if (passwordAgain === '') return setIsPwdAgainError(true);
    if (isPwdError || isPwdAgainError) return;
    dispatch({
      type: types.RESET_PASSWORD,
      data: {
        token,
        password
      }
    });
    dispatch(push('/reset-password-success'));
  }

  const onHandlePwdAgain = (e) => {
    const { value } = e.target;
    if (!value) return setIsPwdAgainError(true);
    if (value !== password) setIsPwdAgainError(true);
  }

  const onPrevpage = () => dispatch(goBack());

  const width = useWidth();
  const inputStyle = { WebkitBoxShadow: "0 0 0 1000px white inset" };

  return (
    <Grid container direction="row" justify="center" onScroll={e => { console.log(e); e.preventDefault(); }}>
      <Grid item xs={12} sm={8} md={8} lg={8} xl={8} className={classes.root}>
        <FlexDiv className={classes.prevBtn}>
          <PrevOutlinedButton onClick={onPrevpage} />
        </FlexDiv>
        <FlexDiv item column crossAlign="center" className={classes.formContainer}>
          <FlexDiv item column style={{ marginBottom: 24 }}>
            <EqmLogo style={{ width: 120, height: 60, alignSelf: 'center' }}/>
            <Typography variant="h4" className={classes.formTitle}>Reset your password</Typography>
          </FlexDiv>
          <FormInput
            label="Password"
            required
            error={isPwdError}
            helperText={isPwdError ? "Please Check Your Password" : undefined}
            >
            <OutlinedInput
              value={password}
              error={isPwdError}
              type={showPwd ? 'text' : 'password'}
              onChange={onInputChange(setPassword)}
              className={classes.input}
              onBlur={onInputBlur(isValidPassword)(setIsPwdError)}
              onFocus={onInputFocus(setIsPwdError)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPwd ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{ style: inputStyle }}
            />
          </FormInput>  
          <FormInput
            label="Confirm Password"
            required
            error={isPwdAgainError}
            helperText={isPwdAgainError ? "Please Check Your Password" : undefined}
            >
            <OutlinedInput
              value={passwordAgain}
              error={isPwdAgainError}
              type={showPwdAgain ? 'text' : 'password'}
              onChange={onInputChange(setPasswordAgain)}
              className={classes.input}
              onBlur={onHandlePwdAgain}
              onFocus={onInputFocus(setIsPwdAgainError)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPasswordAgain}
                    onMouseDown={handleMouseDownPasswordAgain}
                  >
                    {showPwdAgain ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{ style: inputStyle }}
            />
          </FormInput>
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            className={classes.btn}
          >
            Reset
          </Button>
        </FlexDiv>
      </Grid>
      {width !== 'xs' && <Grid item xs={12} sm={4} md={4} lg={4} xl={4} style={{ height: '100vh' }}>
          <Background />
          <div className={classes.signUpContainer}>
            <Typography variant="h4" className={classes.balance}>Balance Our Planet</Typography>
          </div>
      </Grid>}
    </Grid>
  )
}

export default ResetPassword;