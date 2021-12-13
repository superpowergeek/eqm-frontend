import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import FlexDiv from 'components/shared/FlexDiv';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 12,
    height: 144,
    width: 420,
    maxWidth: '100%',
  },
  cancel: {
    margin: 12,
    marginRight: 0,
    marginBottom: 0,
  },
  confirm: {
    marginLeft: 12,
    marginTop: 12,
    marginBottom: 0,
  },
  warn: {
  }
}));

const ConfirmContent = (props) => {
  const { title, onCancel, onConfirm, confirmLabel, isWarn = false, classes: classNames = {}, description, btnAlign } = props;
  const classes = useStyles();
  return (
    <FlexDiv container column className={clsx(classes.root, classNames.root)}>
      <Typography variant="subtitle1" className={classNames.title}>{title}</Typography>
      {description && <Typography variant="subtitle1" className={clsx(classes.description, classNames.description)}>{description}</Typography>}
      <FlexDiv item grow />
      <FlexDiv item fullWidth mainAlign={btnAlign || 'end'}>
        <Button variant="contained" color="inherit" onClick={onCancel} className={clsx(classes.cancel, classNames.cancel)}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm} className={clsx(classes.confirm, classNames.confirm, { [classes.warn]: isWarn })}>
          {confirmLabel}
        </Button>
      </FlexDiv>
    </FlexDiv>
  )
}

export default ConfirmContent;
