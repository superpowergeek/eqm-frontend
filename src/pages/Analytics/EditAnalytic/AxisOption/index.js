import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import { Divider } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { xAxisModes } from '@constants/chart';
import types from '@constants/actions';
import ExpandCheckboxSection from 'components/shared/ExpandCheckboxSection';
import FlexDiv from 'components/shared/FlexDiv';
import * as Selectors from 'selectors';
import AxisTime from './AxisTime';
import { sourceCategory } from '@constants';

const radioOptions = Object.values(xAxisModes).map(v => v);

const useStyles = makeStyles((theme) => ({
  root: {

  },
  paper: {

  },
  chipContainer: {
    height: 40,
    marginTop: 4,
    marginBottom: 4,
  },
  chip: {
    marginRight: 4,
  },
  leftList: {
    flex: 1,
    overflowY: 'auto',
  },
  rightList: {
    flex: 1,
    overflowY: 'auto',
  },
  domains: {
    overflowX: 'auto',
    padding: 12,
    height: 72,
  },
  content: {
    height: 280,
  },
  assetHeading: {
    flexBasis: 'auto',
  }
}));

const AxisOptions = React.memo(() => {
  const currentId = useSelector(Selectors.selectAnalyticCurrentReportId);
  const { xAxisMode, xAxisItems } = useSelector(Selectors.selectAnalyticCurrentConfig);
  const { config = {} } = useSelector(Selectors.selectAnalyticReportIdMap)[currentId] || {};
  const { subItems = [], sourceCategoryMap = {} } = config.source || {};
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const assetGroups = useSelector(Selectors.selectAssetGroups)[companyId] || {};
  const assetGroupIds = assetGroups.ids || [];
  const assetGroupIdMap = assetGroups.idMap || [];
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleToggle = React.useCallback((object) => () => {
    const isChecked = xAxisItems.findIndex(row => row.uniqueId === object.uniqueId) > -1;
    let newObjectsArray;
    if (isChecked) {
      newObjectsArray = xAxisItems.filter(row => row.uniqueId !== object.uniqueId);
    } else {
      newObjectsArray = [...xAxisItems,object];
    }
    dispatch({
      type: types.UPDATE_CURRENT_XAXIS_ITEMS_BY_ARRAY,
      data: {
        objectsArray: newObjectsArray,
      }
    });
  }, [xAxisItems]);
  
  const handleToggleWithGroupId = React.useCallback((groupId) => (objectsArray) => () => {
    const otherGroup = xAxisItems.filter(object => object.groupId != groupId);
    const newObjectsArray = otherGroup.concat(objectsArray);
    dispatch({
      type: types.UPDATE_CURRENT_XAXIS_ITEMS_BY_ARRAY,
      data: {
        objectsArray: newObjectsArray,
      },
    });
  }, [xAxisItems]);

  const renderChips = React.useCallback(() => {
    return (
      <FlexDiv container row className={classes.chipContainer}>
        {xAxisItems.map((object) => {
          const { value } = object;
          return (
            <Chip key={value} label={value} className={classes.chip} onDelete={handleToggle(object)} />
          )
        })}
        <FlexDiv item grow />
        {xAxisItems.length > 0 && <Typography>{`${xAxisItems.length} of 8 selected`}</Typography>}
      </FlexDiv>
    )
  }, [xAxisItems, classes.chip, classes.chipContainer, handleToggle]);

  const renderItem = React.useCallback((itemSelected) => (object, index) => {
    const { value } = object;
    const isChecked = xAxisItems.findIndex(row => row.value === value) !== -1;
    return (
      <React.Fragment key={index}>
        <ListItem button selected={itemSelected && isChecked} onClick={handleToggle(object)}>
          <ListItemIcon>
            <Checkbox
              color="primary"
              checked={isChecked}
              tabIndex={-1}
              disableRipple
            />
          </ListItemIcon>
          <ListItemText id={value} primary={value} />
        </ListItem>
        <Divider variant="middle" />
      </React.Fragment>
    )
  }, [xAxisItems, handleToggle]);

  const handleDomainChange = (event) => {
    dispatch({
      type: types.UPDATE_CURRENT_CONFIG,
      data: {
        xAxisMode: event.target.value,
        xAxisItems: [],
        domainItems: [],
      },
    })
  };

  const [selectedSource, setSelectedSource] = React.useState(sourceCategory.COMPANY);
  
  const handleSource = (value) => () => {
    setSelectedSource(value);
  }

  const indexGetter = (row) => (value) => {
    return row.value === value.value;
  }

  const renderContent = React.useCallback(() => {
  
    if (xAxisMode === 'Time') {
      return (
        <AxisTime subItems={subItems} />
      );
    }
    if (xAxisMode === 'Categories') {
      return (
        <React.Fragment>
          <FlexDiv item className={classes.leftList} style={{ flexShrink: 'none', flexBasis: 'none' }}>
            <List component="div" role="list" style={{ width: '100%' }}>
              {subItems.map((item, i) => renderItem(true)({ value: item }, i))}
            </List>
          </FlexDiv>
        </React.Fragment>
      )
    }
    // sources
    return (
      <React.Fragment>
        <FlexDiv item className={classes.leftList} style={{ flexShrink: 'none', flexBasis: 'none' }}>
          <List component="div" role="list" style={{ width: '100%' }}>
            {Object.keys(sourceCategoryMap).map((value, index) => {
              const isSelected = selectedSource === value;
              return (
                <React.Fragment key={index}>
                  <ListItem button selected={isSelected} onClick={handleSource(value)}>
                    <ListItemText id={value} primary={value} />
                    <ListItemIcon>
                      <NavigateNextIcon />
                    </ListItemIcon>
                  </ListItem>
                  <Divider variant="middle" />
                </React.Fragment>
              )
            })}
          </List>
        </FlexDiv>
        <Divider orientation="vertical" flexItem />
        <FlexDiv item className={classes.rightList} style={{ flexShrink: 'none', flexBasis: 'none' }}>
          <List component="div" role="list" style={{ width: '100%', padding: 0 }}>
            {sourceCategoryMap[selectedSource] && selectedSource === sourceCategory.ASSET && (
              assetGroupIds.map(id => {
                const assetGroup = assetGroupIdMap[id];
                return (
                  <ExpandCheckboxSection
                    title={assetGroup.name}
                    square
                    key={assetGroup.id}
                    classes={{ heading: classes.assetHeading }}
                    options={sourceCategoryMap[selectedSource].filter(object => object.groupId === assetGroup.id).map((object, i) => {
                      return ({
                        ...object,
                      })
                    })}
                    disabled={false}
                    onChange={handleToggleWithGroupId(assetGroup.id)}
                    checkedItems={xAxisItems.filter(object => object.groupId === assetGroup.id)}
                    indexGetter={indexGetter}
                    labelGetter={row => row.value}
                    keyGetter={row => row.id}
                  >
                  </ExpandCheckboxSection>
                )
              })
            )}
            {sourceCategoryMap[selectedSource] && selectedSource !== sourceCategory.ASSET && (
              sourceCategoryMap[selectedSource].map((object, i) => {
                return renderItem(false)(object, i);
              })
            )}
          </List>
        </FlexDiv>
      </React.Fragment>
    );
  }, [xAxisMode, classes.assetHeading, classes.leftList, classes.rightList, sourceCategoryMap, selectedSource, assetGroupIds, assetGroupIdMap, subItems, renderItem, xAxisItems, handleToggle]);

  return (
    <FlexDiv item column style={{ flex: 2, margin: 4 }} fullHeight className={classes.root}>
      <Typography>X-axis</Typography>
      {renderChips()}
      <Paper elevation={0} variant="outlined" style={{ height: '100%' }} className={classes.paper}>
        <FlexDiv column fullWidth fullHeight>
          <FlexDiv className={classes.domains}>
            <RadioGroup name="domain" value={xAxisMode} onChange={handleDomainChange}>
              {radioOptions.map(option => {
                return (
                  <FormControlLabel key={option} value={option} control={<Radio color="primary" />} label={option} />
                )
              })}
            </RadioGroup>
          </FlexDiv>
          <Divider />
          <FlexDiv row fullWidth fullHeight className={classes.content}>
            {renderContent()}
          </FlexDiv>
        </FlexDiv>
      </Paper>
    </FlexDiv>
  )
});

export default AxisOptions;
