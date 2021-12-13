import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import { onInputChange, onInputBlur, onInputFocus } from 'utils/functions';

const useStyles = makeStyles(theme => ({
  inputContainer: {
    marginTop: 12,
    marginBottom: 12,
    width: 360,
  },
  input: {
    marginTop: 12,
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
}));

const headCountOptions = [
  { label: '1 to 10', value: 10 },
  { label: '11 to 25', value: 25 },
  { label: '26 to 50', value: 50 },
  { label: '51 to 200', value: 200 },
  { label: '201 to 1000', value: 1000 },
  { label: '1001 or 10000', value: 10000 },
  { label: '10001 or more', value: 1000000 },
]

const emptyValidater = (value) => {
  // const reg = '';
  // reg.test(value);
  return !!value;
}

const Step2 = (props) => {
  const {
    onSubmit,
    companyDomain,
    setCompanyDomain,
    companyName,
    setCompanyName,
    name,
    setName,
    role,
    setRole,
    headCount,
    setHeadCount,
  } = props;
  const classes = useStyles();


  const [isCompanyNameError, setIsCompanyNameError] = useState(false);
  const [isCompanyDomainError, setIsCompanyDomainError] = useState(false);

  const handleSubmit = () => {
    if (companyDomain === '') return setIsCompanyDomainError(true);
    if (companyName === '') return setIsCompanyNameError(true);
    if (isCompanyDomainError || isCompanyNameError) return;
    onSubmit();
  }

  return (
    <FlexDiv container column crossAlign="center" style={{ position: 'relative' }}>
      <FormInput
        label="Company Domain"
        required
        error={isCompanyDomainError}
        helperText={isCompanyDomainError ? "Company Domain is required" : undefined}
        >
        <OutlinedInput
          value={companyDomain}
          error={isCompanyDomainError}
          onChange={onInputChange(setCompanyDomain)}
          className={classes.input}
          onBlur={onInputBlur(emptyValidater)(setIsCompanyDomainError)}
          onFocus={onInputFocus(setIsCompanyDomainError)}
        />
      </FormInput>
      <FormInput
        label="Company Name"
        required
        error={isCompanyNameError}
        helperText={isCompanyNameError ? "Company Name is required" : undefined}
        >
        <OutlinedInput
          value={companyName}
          error={isCompanyNameError}
          onChange={onInputChange(setCompanyName)}
          className={classes.input}
          onBlur={onInputBlur(emptyValidater)(setIsCompanyNameError)}
          onFocus={onInputFocus(setIsCompanyNameError)}
        />
      </FormInput>
      <FormInput label="Your Role In Company">
        <OutlinedInput
          value={role}
          onChange={onInputChange(setRole)}
          className={classes.input}
        />
      </FormInput>
      <FormInput label="HeadCount">
        <Select
          variant="outlined" 
          value={headCount}
          onChange={onInputChange(setHeadCount)}
          className={classes.input}  
        >
          {headCountOptions.map(row => <MenuItem key={row.value} value={row.value}>{row.label}</MenuItem>)}
        </Select>
      </FormInput>
      <FormInput label="Name">
        <OutlinedInput
          value={name}
          onChange={onInputChange(setName)}
          className={classes.input}
        />
      </FormInput>
      <Button
        color="primary"
        variant="contained"
        onClick={handleSubmit}
        className={classes.btn}
      >
        Create Your Account
      </Button>
    </FlexDiv>
  )
}

export default Step2;