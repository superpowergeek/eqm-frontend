import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import MuiAppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useDispatch } from 'react-redux';
import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import AssignFromTable from './AssignFromTable';
import AssignToTable from './AssignToTable';
import TableTabs from "../TableTabs";
import SubTabs from 'components/shared/SubTabs';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb(244,247,249)'
  },
  content: {
    padding: 24,
  },
  paperContent: {
    minHeight: '100%',
    border: 'none',
    boxShadow: 'rgba(193, 203, 208, 0.56) 0 1px 4px 1px '
  }
}))

const AssignTab = () => {
  const dispatch = useDispatch();
  const [subTabValue, setSubTabValue] = React.useState(0);

  const handleSubTabChange = (e, value) => setSubTabValue(value);

  const classes = useStyles();
  const labels = ['Assigned To', 'Assigned From'];
  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{ minHeight: '100%' }} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          <TableTabs value={2}/>
          <Paper square variant="outlined" elevation={0} style={{ margin: 12 }}>
            <SubTabs labels={labels} value={subTabValue} handleChange={handleSubTabChange}/>
            {subTabValue === 0 &&
              <AssignToTable />
            }
            {subTabValue === 1 &&
              <AssignFromTable />
            }
          </Paper>

        </Paper>
      </FlexDiv>
    </FlexDiv>
  )
}

export default AssignTab;
