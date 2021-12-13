import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import Unchecked from 'components/Icons/CircleUnchecked';
import Checked from 'components/Icons/CircleChecked';
import { onInputChange, onInputBlur, onInputFocus } from 'utils/functions';
import { isValidEmail, isValidPassword } from 'utils/validators';

const useStyles = makeStyles(theme => ({
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
  btn: {
    marginTop: 16,
    textTransform: 'none',
    height: 40,
    width: 360,
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
  },
  labelLink: {
    color: fade(theme.palette.primary.main, 0.7),
    marginLeft: 4,
    marginRight: 4,
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:active': {
      color: fade(theme.palette.primary.main, 0.5),
    }
  }
}));

const Step1 = (props) => {
  const classes = useStyles();
  const { email, setEmail, password, setPassword, passwordAgain, setPasswordAgain, onSubmit } = props; 
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdAgain, setShowPwdAgain] = useState(false);
  const handleClickShowPassword = useCallback(() => setShowPwd(preValue => !preValue), []);
  const handleMouseDownPassword = useCallback(() => (event) => event.preventDefault(), []);
  const handleClickShowPasswordAgain = useCallback(() => setShowPwdAgain(preValue => !preValue), []);
  const handleMouseDownPasswordAgain = useCallback(() => (event) => event.preventDefault(), []);

  const [isEmailError, setIsEmailError] = useState(false);
  const [isPwdError, setIsPwdError] = useState(false);
  const [isPwdAgainError, setIsPwdAgainError] = useState(false);
  const onTerms = (e) => e.preventDefault();

  const onHandlePwdAgain = (e) => {
    const { value } = e.target;
    if (!value) return setIsPwdAgainError(true);
    if (value !== password) setIsPwdAgainError(true);
  }

  const onNext = () => {
    if (email === '') return setIsEmailError(true);
    if (password === '') return setIsPwdError(true);
    if (passwordAgain === '') return setIsPwdAgainError(true);
    if (isEmailError || isPwdError || isPwdAgainError) return;
    onSubmit();
  }

  return (
    <FlexDiv container column crossAlign="center">
      <FormInput
        label="Account"
        required
        error={isEmailError}
        helperText={isEmailError ? "Please Check Your Account" : undefined}
        >
        <OutlinedInput
          value={email}
          error={isEmailError}
          placeholder={"your@email.com"}
          onChange={onInputChange(setEmail)}
          className={classes.input}
          onBlur={onInputBlur(isValidEmail)(setIsEmailError)}
          onFocus={onInputFocus(setIsEmailError)}
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
      <FlexDiv item column crossAlign="start" width={360}>
        <FormControlLabel 
          control={
            <Checkbox
              color="primary"
              defaultChecked
              icon={<Unchecked />}
              checkedIcon={<Checked />}
            />
          }
          label={
            <div style={{ fontSize: 12 }}>
              I accept EQM's 
              <span className={classes.labelLink} onClick={onTerms}>Terms of Service</span> 
              and 
              <span className={classes.labelLink} onClick={onTerms}>Privacy Policy</span>
            </div>
          }
        />
        <FormControlLabel 
          control={
            <Checkbox
              color="primary"
              defaultChecked
              icon={<Unchecked />}
              checkedIcon={<Checked />}
            />
          }
          label={<div style={{ fontSize: 12 }}>I'm interested in receiving the news from EQM</div>}
        />
      </FlexDiv>
      
      <Button
        color="primary"
        variant="contained"
        onClick={onNext}
        className={classes.btn}
      >
        Next
      </Button>
    </FlexDiv>
  )
}

export default Step1;