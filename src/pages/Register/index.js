import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router';
import { goBack } from 'connected-react-router';
import NavigateBeforeRounded from '@material-ui/icons/NavigateBeforeRounded';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import debounce from 'lodash/debounce';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import EqmLogo from 'components/Icons/EqmLogo';

import Step1 from './Step1';
import Step2 from './Step2';
import FlexDiv from 'components/shared/FlexDiv';


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
  navigateBefore: {
    position: 'absolute',
    left: 0,
    top: 16,
    border: `1px ${theme.palette.primary.main} solid`,
  },
  errorMsg: {
    color: theme.palette.error.main,
    alignSelf: 'center',
    marginTop: 24,
  }
}));

const Register = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(Selectors.selectUser);
  const registError = useSelector(Selectors.selectRegistError);
  const postCompanyError = useSelector(Selectors.selectPostCompanyError);
  const [currentStep, setCurrentStep] = useState(1);
  // step 1 fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  // step 2 fields
  const [companyDomain, setCompanyDomain] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [headCount, setHeadCount] = useState(10);
  const [name, setName] = useState('');
  const nextStep = () => { setCurrentStep(s => s + 1) };
  const prevStep = () => { setCurrentStep(s => s - 1) };
  const handleSubmit = debounce(() => {
    dispatch({
      type: types.REGIST_USER,
      data: {
        email,
        password,
        companyDomain,
        companyName,
        role,
        headCount,
        name,
      }
    })
  }, 1000);

  const onPrevPage = () => dispatch(goBack());

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={10} sm={6} md={4} lg={4} className={classes.form}>
        <FlexDiv item column>
          <EqmLogo style={{ width: 120, height: 60, alignSelf: 'center' }}/>
          <Typography variant="h5" className={classes.formTitle}>Create Account</Typography>
          {currentStep === 1 && 
            <Step1
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              passwordAgain={passwordAgain}
              setPasswordAgain={setPasswordAgain}
              onSubmit={nextStep} 
            />
          }
          {currentStep === 2 && 
            <Step2
              companyDomain={companyDomain}
              setCompanyDomain={setCompanyDomain}
              companyName={companyName}
              setCompanyName={setCompanyName}
              name={name}
              setName={setName}
              role={role}
              setRole={setRole}
              headCount={headCount}
              setHeadCount={setHeadCount}
              onSubmit={handleSubmit} 
            />}
          {(registError && <div className={classes.errorMsg}>{registError.message}</div>)}
        </FlexDiv>
        {currentStep === 1 &&
          <IconButton className={classes.navigateBefore} size="small" onClick={onPrevPage}>
            <NavigateBeforeRounded />
          </IconButton>
        }
        {currentStep === 2 && 
          <IconButton className={classes.navigateBefore} size="small" onClick={prevStep}>
            <NavigateBeforeRounded />
          </IconButton>
        }
        {user && <Redirect to='/dashboard' />}
      </Grid>
    </Grid>
  )
}

export default Register;