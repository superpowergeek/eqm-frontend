import React from 'react';
import Typography from '@material-ui/core/Typography';

const TabPanel = (props) =>{
  const { children, page, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      id={`simple-tabpanel-${page}`}
      aria-labelledby={`simple-tab-${page}`}
      {...other}
    >
      {children}
    </Typography>
  );
}

export default TabPanel;