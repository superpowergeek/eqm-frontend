import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { replace } from 'connected-react-router';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import debounce from 'lodash/debounce';

import * as Selectors from 'selectors';
import ProgressModal from 'components/shared/ProgressModal';
import EqmLogo from 'components/Icons/EqmLogo';
import CircleChecked from 'components/Icons/CircleChecked';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import { onInputChange, onInputBlur, onInputFocus } from 'utils/functions';
import { isValidPassword } from 'utils/validators';
import RequestApi from 'utils/RequestApi';


const useStyles = makeStyles(theme => ({
  form: {
    marginTop: 48,
    position: 'relative',
  },
  formTitle: {
    marginTop: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
  inputContainer: {
    marginTop: 12,
    marginBottom: 12,
    width: 360,
  },
  input: {
    marginTop: 12,
    marginBottom: 12,
    height: 40,
  },
  errorMsg: {
    color: theme.palette.error.main,
    alignSelf: 'center',
  },
  btn: {
    marginTop: 16,
    marginBottom: 24,
    textTransform: 'none',
    height: 40,
    width: 360,
  },
}));

const Invitation = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { location } = props;
  const parsed = queryString.parse(location.search);
  const { code } = parsed;
  React.useEffect(() => {
    (async () => {
      try {
        const { data } = await RequestApi({
          url: `/invitation/code/${code}`,
          method: 'get',
        })
        setDisableInfo(data);
      } catch (e) {
        dispatch(replace('/login'));
      }
    })()
  }, []);
  
  const [disabledInfo, setDisableInfo] = React.useState({});
  const user = useSelector(Selectors.selectUser);
  
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdAgain, setShowPwdAgain] = useState(false);
  const handleClickShowPassword = React.useCallback(() => setShowPwd(preValue => !preValue), []);
  const handleMouseDownPassword = React.useCallback(() => (event) => event.preventDefault(), []);
  const handleClickShowPasswordAgain = React.useCallback(() => setShowPwdAgain(preValue => !preValue), []);
  const handleMouseDownPasswordAgain = React.useCallback(() => (event) => event.preventDefault(), []);
  const [isPwdError, setIsPwdError] = useState(false);
  const [isPwdAgainError, setIsPwdAgainError] = useState(false);

  const onHandlePwdAgain = (e) => {
    const { value } = e.target;
    if (!value) return setIsPwdAgainError(true);
    if (value !== password) setIsPwdAgainError(true);
  }

  const [redirect, setRedirect] = React.useState(false);
  const [registResult, setRegistResult] = React.useState({
    status: 'idle',
  });
  const handleSubmit = debounce(async () => {
    try {
      setRegistResult({
        status: 'pending',
      })
      const data = new FormData()
      data.set('password', password);
      await RequestApi({
        url: `/invitation/${code}/consume`,
        method: 'post',
        data,
      })
      setTimeout(() => setRegistResult({
        status: 'success',
      }), 1000);
      setTimeout(() => setRedirect(true), 2000);
    } catch (e) {
      setTimeout(() => setRegistResult({
        status: 'failed',
        error: e,
      }), 1000);
    }
  }, 300);

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={10} sm={6} md={4} lg={4} className={classes.form}>
        <FlexDiv item column>
          <EqmLogo style={{ width: 120, height: 60, alignSelf: 'center' }}/>
          <Typography variant="h5" className={classes.formTitle}>Finish Account Creation</Typography>
        </FlexDiv>
        <FlexDiv container column crossAlign="center">
          <FormInput        
            label="Account"
            required
            >
            <OutlinedInput
              value={disabledInfo.email || ''}
              disabled
              className={classes.input}
            />
          </FormInput>
          <FormInput label="Your Role In Company">
            <OutlinedInput
              value={disabledInfo.role || ''}
              disabled
              className={classes.input}
            />
          </FormInput>
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
            />
          </FormInput>
          {registResult.error && <div className={classes.errorMsg}>{'Registeration error, please try again.'}</div>}
          {registResult.status === 'success' && (
            <React.Fragment>
              <CircleChecked style={{ width: 24, height: 24, alignSelf: 'center' }} />
              {redirect && <Redirect to={`/login?code=${code}`} />}
            </React.Fragment>
          )}
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            className={classes.btn}
          >
            Create Your Account
          </Button>
        </FlexDiv>
        
        {user && <Redirect to='/dashboard' />}
        <ProgressModal 
          open={registResult.status === 'pending'}
        />
      </Grid>
    </Grid>
  )
}

export default Invitation;