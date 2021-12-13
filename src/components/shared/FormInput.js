import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import FlexDiv from 'components/shared/FlexDiv';
import InputLabel from '@material-ui/core/InputLabel';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: 12,
    marginBottom: 12,
    width: 360,
  },
  errorHelper: {
    color: theme.palette.error.main,
  },
  inputLabel: {
  },
  helperText: {
  },
  columnMargin: {
    marginBottom: 12,
  }
}))

const FormInput = (props) => {
  const {
    children,
    label,
    helperText,
    error,
    classes: classNames = {},
    required,
    compProps = {},
    direction = 'column'
  } = props; 
  const classes = useStyles();
  return (
    <FlexDiv item column className={clsx(classes.container, classNames.container)} {...compProps.container}>
      <FlexDiv item column={direction === 'column'} className={classNames.inputContainer} {...compProps.inputContainer}>
        {label && 
          <InputLabel
            required={required}
            className={clsx(classes.inputLabel, classNames.inputLabel, { [classes.columnMargin]: direction === 'column' })}
            {...compProps.inputLabel}>
              {label}
          </InputLabel>}
        {children}
      </FlexDiv>
      {helperText && 
        <FormHelperText
          className={clsx(classes.helperText, classNames.helperText, { [classes.errorHelper]: error })}
          {...compProps.helperText}>
            {helperText}
        </FormHelperText>}
    </FlexDiv>
  )
}

export default FormInput;
