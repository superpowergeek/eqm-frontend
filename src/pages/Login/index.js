import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Redirect } from 'react-router';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { push, goBack } from 'connected-react-router';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import EqmLogo from 'components/Icons/EqmLogo';
import { onInputChange } from 'utils/functions';
import { useWidth } from 'utils/hooks';
import Background from 'components/Icons/Background';
import PrevOutlinedButton from 'components/shared/PrevOutlinedButton';
import Unchecked from 'components/Icons/CircleUnchecked';
import Checked from 'components/Icons/CircleChecked';
import RequestApi from 'utils/RequestApi';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: 48,
  },
  formContainer: {

  },
  formTitle: {
    marginTop: 24,
    alignSelf: 'center',
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
  },
  rememberMe: {
    color: fade(theme.palette.grey[700], 0.9),
  }
}));

const onCheckChange = cb => e => cb(e.target.checked);

const emptyValidater = (value) => {
  // const reg = '';
  // reg.test(value);
  return !!value;
}

const Login = (props) => {
  const { location } = props;
  React.useEffect(() => {
    if (!location) return;
    const parsed = queryString.parse(location.search);
    const { code } = parsed;
    if (!code) return;
    (async () => {
      const { data } = await RequestApi({
        url: `/invitation/code/${code}`,
        method: 'get',
      })
      const { email } = data;
      setEmail(email);
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPwdError, setIsPwdError] = useState(false);

  const dispatch = useDispatch();
  const rememberMe = useSelector(Selectors.selectRememberMe);
  const user = useSelector(Selectors.selectUser);
  const authError = useSelector(Selectors.selectAuthError);
  const onSubmit = () => {
    dispatch({
      type: types.AUTH_USER,
      data: {
        email,
        password,
      }
    });
  }
  const setRememberMe = (value) => {
    dispatch({
      type: types.UPDATE_REMEMBER_ME,
      data: {
        value,
      },
    })
  }

  const handleClickShowPassword = useCallback(() => setShowPwd(preValue => !preValue), []);
  const handleMouseDownPassword = useCallback(() => (event) => event.preventDefault(), []);

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
            <Typography variant="h4" className={classes.formTitle}>Welcome Back!</Typography>
            {/* <Typography variant="body2" className={classes.formTitle}>
              Don't have an account?
              <Link
                onClick={onClickRegist}
                href="#"
                className={classes.signUp}
              >
                Sign up
              </Link>
            </Typography> */}
          </FlexDiv>
          <FormInput
            label="Account"
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
              inputProps={{ style: inputStyle }}
            />
          </FormInput>
          <FormInput
            label="Password"
            classes={{ container: classes.formInput }}>
            <OutlinedInput
              value={password}
              error={isPwdError}
              type={showPwd ? 'text' : 'password'}
              onChange={onInputChange(setPassword)}
              className={classes.input}
              onBlur={onHandleBlur(emptyValidater)(setIsPwdError)}
              onFocus={onHandleFocus(setIsPwdError)}
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
          <FlexDiv item crossAlign="center" mainAlign="between" width={360}>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={rememberMe}
                  onChange={onCheckChange(setRememberMe)}
                  icon={<Unchecked />}
                  checkedIcon={<Checked />}
                />
              }
              className={classes.rememberMe}
              label="Remember me"
            />
            <Link
              href="/forgot-password"
              className={classes.link}
            >
              Forgot password
            </Link>
          </FlexDiv>
          {user ? <Redirect to='/dashboard' /> : (authError && <div className={classes.errorMsg}>{"Username or password does not match."}</div>)}
          <Button
            color="primary"
            variant="contained"
            onClick={onSubmit}
            className={classes.btn}
          >
            Log In
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

export default Login;
