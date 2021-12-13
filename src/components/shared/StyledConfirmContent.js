import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import FlexDiv from 'components/shared/FlexDiv';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 24,
    height: 200,
    width: 596,
    maxWidth: '100%',
  },
  cancel: {
    fontSize: '1rem',
    textTransform: 'unset',
    paddingLeft: 48,
    paddingRight: 48,
    margin: 12,
    marginRight: 0,
    marginBottom: 0,
  },
  confirm: {
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 0,
    color: 'white',
    fontSize: '1rem',
    textTransform: 'unset',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
    paddingLeft: 48,
    paddingRight: 48
  },
  warn: {
  },
  description: {
    color: '#757575'
  }
}));

const StyledConfirmContent = (props) => {
  const { title, onCancel, onConfirm, confirmLabel, isWarn = false, description, btnAlign } = props;
  const classes = useStyles();
  return (
    <FlexDiv container column className={classes.root}>
      <Typography variant="subtitle1" className={classes.title}>{title}</Typography>
      {description && <Typography variant="subtitle1" className={classes.description}>{description}</Typography>}
      <FlexDiv item grow />
      <FlexDiv item fullWidth mainAlign={btnAlign || 'end'}>
        <Button variant="contained" onClick={onCancel} className={classes.cancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm} className={classes.confirm}>
          {confirmLabel}
        </Button>
      </FlexDiv>
    </FlexDiv>
  )
}

export default StyledConfirmContent;
