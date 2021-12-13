import React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';

import { manageDataTabsMap } from '@constants';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'white',
    color: '#333333',
    fontSize: '1rem',
    textTransform: 'unset',
    boxShadow: 'none'
  },
  indicator: {
    backgroundColor: '#ef5423',
  },
  tab: {
    textTransform: 'unset',
    minWidth: 120
  }
}))

const TableTabs = ({ value }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    dispatch(push(`/data-management/${manageDataTabsMap[newValue]}`))
  };

  return (
    <MuiAppBar position="static" color="primary" className={ classes.appBar }>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" classes={{indicator: classes.indicator}}>
        <Tab label="Asset Group" className={classes.tab}/>
        <Tab label="Travel" className={classes.tab}/>
        <Tab label="Assign" className={classes.tab}/>
        <Tab label="Commute" className={classes.tab}/>
        <Tab label="Purchases" className={classes.tab}/>
        <Tab label="Utilty" className={classes.tab}/>
        <Tab label="Waste" className={classes.tab}/>
        <Tab label="Employee" className={classes.tab}/>
        <Tab label="Product" className={classes.tab} />
      </Tabs>
    </MuiAppBar>
  )
}

export default TableTabs;