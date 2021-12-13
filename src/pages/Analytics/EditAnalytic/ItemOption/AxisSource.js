import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputLabel from '@material-ui/core/InputLabel';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/styles';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Divider } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch, useSelector } from 'react-redux';

import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import types from '@constants/actions';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  paper: {

  },
  chipContainer: {
    height: 40,
    marginTop: 4,
    marginBottom: 4,
    overflowX: 'auto',
  },
  chip: {
    marginRight: 4,
  },
  content: {
    height: 280,
    overflowY: 'auto',
  },
}));

const AxisSource = () => {
  const dispatch = useDispatch();
  const currentId = useSelector(Selectors.selectAnalyticCurrentReportId);
  const { config = {} } = useSelector(Selectors.selectAnalyticReportIdMap)[currentId] || {};
  const { subItems = [] } = config.source || {};
  const { domainItems } = useSelector(Selectors.selectAnalyticCurrentConfig);
  const classes = useStyles();

  const handleToggle = React.useCallback((object) => () => {
    dispatch({
      type: types.UPDATE_CURRENT_DOMAIN_ITEMS,
      data: {
        object,
      },
    });
  }, [dispatch]);

  const renderItem = React.useCallback((action) => (object, index) => {
    const selected = domainItems.findIndex(row => row.value === object.value) !== -1;
    return (
      <React.Fragment key={index}>
        <ListItem button selected={selected} onClick={handleToggle(object)}>
          <ListItemIcon>
            <Checkbox
              color="primary"
              checked={selected}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText id={object.value} primary={object.value} />
          {action && <ListItemSecondaryAction>
            <IconButton edge="end" onClick={() => {}}>
              <NavigateNextIcon />
            </IconButton>
          </ListItemSecondaryAction>}
        </ListItem>
        <Divider variant="middle" />
      </React.Fragment>
    )
  }, [domainItems, handleToggle]);

  return (
    <FlexDiv column fullWidth fullHeight>
      <FlexDiv item style={{  padding: 12, height: 72, boxSizing: 'border-box' }} crossAlign="center">
        <InputLabel>Category</InputLabel>
      </FlexDiv>
      <Divider />
      <FlexDiv item className={classes.content}>
        <List component="div" role="list" style={{ width: '100%' }}>
          {subItems.map((row, i) => renderItem(false)({ value: row, level: 0 }, i))}
        </List>
      </FlexDiv>
    </FlexDiv>
  )
}

export default AxisSource;
