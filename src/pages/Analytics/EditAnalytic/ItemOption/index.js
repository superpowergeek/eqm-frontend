import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import { useSelector, useDispatch } from 'react-redux';

import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import * as Selectors from 'selectors';
import { xAxisModes } from '@constants/chart';
import AxisSource from './AxisSource';
import AxisCategory from './AxisCategory';

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

const ItemOptions = React.memo(() => {
  const classes = useStyles();
  const { xAxisMode, domainItems } = useSelector(Selectors.selectAnalyticCurrentConfig);
  const dispatch = useDispatch();

  const handleToggle = React.useCallback((object) => () => {
    dispatch({
      type: types.UPDATE_CURRENT_DOMAIN_ITEMS,
      data: {
        object,
      },
    });
  }, [dispatch]);
  

  const renderChips = React.useCallback(() => {
    return (
      <FlexDiv container row className={classes.chipContainer}>
        {domainItems.map((object) => (
          <Chip key={object.value} label={object.value} className={classes.chip} onDelete={handleToggle(object)} />
        ))}
        <FlexDiv item grow />
        {domainItems.length > 0 && <Typography>{`${domainItems.length} of 5 selected`}</Typography>}
      </FlexDiv>
    )
  }, [domainItems, classes.chip, classes.chipContainer, handleToggle]);



  const renderContent = () => {
    if (xAxisMode === xAxisModes.SOURCES) {
      return <AxisSource />
    }
    // mode is time/category
    return <AxisCategory />
  }
  return (
    <FlexDiv item column style={{ flex: 2, margin: 4 }} fullHeight className={classes.root}>
      <Typography>Domain Item</Typography>
      {renderChips()}
      <Paper elevation={0} variant="outlined" style={{ height: '100%' }} className={classes.paper}>
        {renderContent()}
      </Paper>
    </FlexDiv>
  )
});

export default ItemOptions;
