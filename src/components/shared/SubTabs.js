import React from 'react';
import MuiAppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { makeStyles } from '@material-ui/core/styles';

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

const SubTabs = ({ labels, value, handleChange }) => {
  const classes = useStyles();
 
  return (
    <MuiAppBar position="static" color="primary" className={ classes.appBar }>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" classes={{indicator: classes.indicator}}>
        {labels.map(label => {
          return <Tab key={label} label={label} className={classes.tab}/>
        })}
      </Tabs>
    </MuiAppBar>
  )
}

export default SubTabs;