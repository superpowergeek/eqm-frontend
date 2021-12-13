import React from 'react';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, Typography } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
  },
  summary: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '40%',
    flexShrink: 0,
  },
  secondHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  detail: {
    flexDirection: 'column',
  }
}));
const ExpandSection = (props) => {
  const classes = useStyles();
  const { title = 'default title', subTitle, square, children, className, classes: parentClasses = {}, ...others } = props;
  const [expand, setExpand] = React.useState(false);
  const handlExpandClick = React.useCallback(() => {
    setExpand(prevExpand => !prevExpand);
  }, []);
  return (
    <ExpansionPanel
      expanded={expand}
      onChange={handlExpandClick}
      square={square}
      className={clsx(classes.root, className)}
      {...others}
    >
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
        <Typography className={clsx(classes.heading, parentClasses.heading)}>{title}</Typography>
        {subTitle && <Typography className={clsx(classes.secondHeading, parentClasses.secondHeading)}>{subTitle}</Typography>}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={clsx(classes.detail, parentClasses.detail)}>
        {children}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
export default ExpandSection;