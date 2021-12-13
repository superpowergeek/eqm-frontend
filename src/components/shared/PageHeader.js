import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import FlexDiv from 'components/shared/FlexDiv';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 60,
    paddingRight: 60,
    paddingTop: 80,
    paddingBottom: 20
  },
}));

const PageHeader = (props) => {
  const { title, titleElement, children } = props;
  const classes = useStyles();
  return (
    <FlexDiv fullWidth style={{ minHeight: 64 }} crossAlign="center" className={classes.root}>
      {titleElement || <Typography variant="h5" color="primary">{title}</Typography>}
      <FlexDiv item grow />
      {children}
    </FlexDiv>
  )
}

export default PageHeader;
