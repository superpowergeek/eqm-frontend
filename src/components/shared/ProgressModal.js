import React from 'react';
import { makeStyles } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circular: {
    '&:focus': {
      outline: 'none',
    }
  }
}))

const ProgressModal = React.memo((props) => {
  const classes = useStyles();
  const { open, handleClose } = props;
  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <CircularProgress classes={{ root: classes.circular }}/>
    </Modal>
  )
});

export default ProgressModal;
