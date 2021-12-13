import React from 'react';
import clsx from 'clsx';

import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme =>({
  root: {
  },
  headerFullWidth: {
    width: '100%',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const SectionCollapse = (props) => {
  const classes = useStyles();
  const { children, title = 'default title', collapse = true, ...others } = props;
  const [expand, setExpand] = React.useState(false);

  const handleExpandClick = React.useCallback(() => {
    setExpand(prevExpand => !prevExpand);
  }, []);

  return (
    <div className={classes.root}>      
      <Typography>
        {title}
        {collapse && (
          <IconButton
            className={clsx({
                [classes.expand] : expand,
                [classes.expandOpen] : expand,
            })}
            onClick = {handleExpandClick}
            color = "primary"
          >
            <ExpandMoreIcon />
          </IconButton>
        )}         
      </Typography>                   
      <Collapse
        in = {expand}
        timeout = "auto"
        unmountOnExit
      >
        <Typography>
          {children}
        </Typography>
      </Collapse>
    </div>
  )
}

export default SectionCollapse;