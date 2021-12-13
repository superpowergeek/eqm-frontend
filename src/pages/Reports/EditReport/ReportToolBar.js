import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import BarChartIcon from '@material-ui/icons/BarChart';
import ListIcon from '@material-ui/icons/List';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import { makeStyles, Button } from '@material-ui/core';
import clsx from 'clsx';

import FlexDiv from 'components/shared/FlexDiv';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 32,
    height: 240,
  },
  container: {
    padding: 12,
  },
  withBorder: {
    border: `2px dashed`,
  },
  icon: {
    margin: 8,
  }
}));

const ReportToolBar = React.memo((props) => {
  const classes = useStyles();
  const { events = {}, withBorder = true } = props;
  const {
    onAddChart = () => {},
    onAddTable = () => {},
    onAddImage = () => {},
    onCancel = () => {},
  } = events;

  return (
    <FlexDiv container fullWidth column className={clsx(classes.root, { [classes.withBorder]: withBorder } )}>
      <FlexDiv row fullWidth fullHeight mainAlign="center" crossAlign="center">
        <FlexDiv column crossAlign="center" className={classes.container}>
          <IconButton onClick={onAddChart} className={classes.icon}>
            <BarChartIcon />
          </IconButton>
          <InputLabel>Chart</InputLabel>
        </FlexDiv>
        <FlexDiv column crossAlign="center" className={classes.container}>
          <IconButton onClick={onAddTable} className={classes.icon}>
            <ListIcon />
          </IconButton>
          <InputLabel>Data</InputLabel>
        </FlexDiv>
        <FlexDiv column crossAlign="center" className={classes.container}>
          <IconButton onClick={onAddImage} className={classes.icon}>
            <InsertPhotoIcon />
          </IconButton>
          <InputLabel>Image</InputLabel>
        </FlexDiv>
      </FlexDiv>
      <FlexDiv item row fullWidth mainAlign="center" style={{ marginTop: 24, marginBottom: 24 }} height={60}>
        <Button color="primary" variant="outlined" onClick={onCancel} style={{ marginRight: 24 }}>Cancel</Button>
      </FlexDiv>
    </FlexDiv>
  )
});

export default ReportToolBar;