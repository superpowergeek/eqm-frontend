import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import SubTabs from 'components/shared/SubTabs';
import CompanyUserTable from './CompanyUserTable';
import CompanyUserInvitationTable from './CompanyUserInvitationTable';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'rgb(244,247,249)'
  },
}));

const labels = ['Users', 'User Invitations'];

const Accounts = () => {
  const classes = useStyles();
  const [subTabValue, setSubTabValue] = React.useState(0);
  const handleSubTabChange = (e, value) => setSubTabValue(value);
  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{minHeight: '100%'}}>
      <AppBar/>
      <PageHeader title="Accounts"></PageHeader>
      <FlexDiv fullWidth style={{minHeight: '100%'}} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} style={{margin: 12}}>
          <SubTabs labels={labels} value={subTabValue} handleChange={handleSubTabChange} />
          {subTabValue === 0 &&
            <CompanyUserTable />
          }
          {subTabValue === 1 &&
            <CompanyUserInvitationTable />
          }
        </Paper>
      </FlexDiv>
    </FlexDiv>
  )
}

export default Accounts;
