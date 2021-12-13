import React from 'react';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import FormInput from 'components/shared/FormInput';
import FlexDiv from 'components/shared/FlexDiv';
import { onInputChange } from 'utils/functions';
import types from '@constants/actions';

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: '100%',
    width: '80%', 
  },
  main: {
    width: '70%',
    boxSizing: 'border-box',
    padding: 24,
    alignSelf: 'center',
  },
  input: {
    height: 36,
    marginLeft: 24,
    width: '70%',
  },
  container: {
    width: '100%',
    marginTop: 32
  },
}));

const roleOptions = [
  'Administrator',
  'Editor',
  'Reader',
]

const CompanyUserInvitationDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userInvitation } = props;
  const isEdit = !!userInvitation;
  const [username, setUserName] = React.useState(userInvitation?.username || '');
  const [name, setName] = React.useState(userInvitation?.name || '');
  const [role, setRole] = React.useState(userInvitation?.role || roleOptions[0]);
  const [snack, setSnack] = React.useState({ open: false, status: 'success' });
  const submit = () => {
    dispatch({
      type: types.ADD_COMPANY_USER_INVITATION,
      [WAIT_FOR_ACTION]: types.ADD_COMPANY_USER_INVITATION_SUCCESS,
      [ERROR_ACTION]: types.ADD_COMPANY_USER_INVITATION_ERROR,
      data: {
        name,
        email: username,
        role,
      }
    }).then(result => {
      setSnack({ open: true, status: 'success' });
      setTimeout(props.onClose, 1200);
    }).catch(e => {
      setSnack({ open: true, status: 'error' });
    })
  };

  return (
    <Dialog open={props.open || false} onClose={props.onClose} className={classes.root} classes={{ paperWidthSm: classes.paper }}>
      <FlexDiv column className={classes.main}>
        <Typography variant="h5" className={classes.formTitle}>{isEdit ? "Edit Invitation" : "Add Invitation"}</Typography>
        <FormInput
          direction="row"
          compProps={{ inputContainer: { crossAlign: 'center' }}}
          label="Email"
          classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
          <FlexDiv item grow />
          <OutlinedInput
            value={username} 
            type='text'
            onChange={onInputChange(setUserName)}
            className={classes.input} 
          />
        </FormInput>
        <FormInput
          direction="row"
          compProps={{ inputContainer: { crossAlign: 'center' }}}
          label="Name"
          classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
          <FlexDiv item grow />
          <OutlinedInput
            value={name} 
            type='text'
            onChange={onInputChange(setName)}
            className={classes.input} 
          />
        </FormInput>
        <FormInput
          direction="row"
          compProps={{ inputContainer: { crossAlign: 'center' }}}
          label="Role"
          classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
          <FlexDiv item grow />
          <Select
            variant="outlined"
            value={role} 
            onChange={onInputChange(setRole)}
            className={classes.input} 
          >
            {roleOptions.map(role => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </FormInput>
        <FlexDiv item row fullWidth mainAlign="center" style={{ marginBottom: 32, marginTop: 78, clear: "both", minHeight: "unset"}}>
          <Button color="primary" variant="outlined" onClick={props.onClose} style={{ marginRight: 24 }}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={submit}>Submit</Button>
        </FlexDiv>
      </FlexDiv>
      <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <MuiAlert variant="filled" severity={snack.status}>{`Send Invitation ${snack.status}!`}</MuiAlert>
      </Snackbar>
    </Dialog>
  )
}

export default CompanyUserInvitationDialog;
