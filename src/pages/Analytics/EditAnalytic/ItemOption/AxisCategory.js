import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputLabel from '@material-ui/core/InputLabel';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { makeStyles } from '@material-ui/styles';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Divider } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { useDispatch, useSelector } from 'react-redux';

import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import ExpandCheckboxSection from 'components/shared/ExpandCheckboxSection';

import types from '@constants/actions';
import { sourceCategory } from '@constants';

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
  leftList: {
    flex: 1,
    overflowY: 'auto',
  },
  rightList: {
    flex: 1,
    overflowY: 'auto',
  },
  assetHeading: {
    flexBasis: 'auto',
  }
}));

const AxisCategory = React.memo(() => {
  const dispatch = useDispatch();
  const currentId = useSelector(Selectors.selectAnalyticCurrentReportId);
  const { config = {} } = useSelector(Selectors.selectAnalyticReportIdMap)[currentId] || {};
  const { sourceCategoryMap = {} } = config.source || {};
  const { domainItems } = useSelector(Selectors.selectAnalyticCurrentConfig);
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const assetGroups = useSelector(Selectors.selectAssetGroups)[companyId] || {};
  const assetGroupIds = assetGroups.ids || [];
  const assetGroupIdMap = assetGroups.idMap || {};
  const [selectedSource, setSelectedSource] = React.useState(sourceCategory.COMPANY);
  const handleSource = (value) => () => {
    setSelectedSource(value);
  }
  const classes = useStyles();

  const handleToggle = React.useCallback((object) => () => {
    dispatch({
      type: types.UPDATE_CURRENT_DOMAIN_ITEMS,
      data: {
        object,
      },
    });
  }, []);
  const handleToggleByArray = React.useCallback((groupId) => (objectsArray) => () => {
    const otherGroup = domainItems.filter(object => object.groupId != groupId);
    const newObjectsArray = otherGroup.concat(objectsArray);
    dispatch({
      type: types.UPDATE_CURRENT_DOMAIN_ITEMS_BY_ARRAY,
      data: {
        objectsArray: newObjectsArray,
      },
    });
  }, [domainItems]);

  const indexGetter = (row) => (value) => {
    return row.value === value.value;
  }

  const renderItem = React.useCallback((itemSelected) => (object, index) => {
    const { value } = object;
    const isChecked = domainItems.findIndex(row => row.value === value) !== -1;
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
  }, [domainItems, handleToggle]);

  return (
    <FlexDiv column fullWidth fullHeight>
      <FlexDiv item style={{  padding: 12, height: 72, boxSizing: 'border-box' }} crossAlign="center">
        <InputLabel >Sources</InputLabel>
      </FlexDiv>
      <Divider />
      <FlexDiv item grow row fullWidth className={classes.content}>
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
                    options={sourceCategoryMap[selectedSource].filter(object => object.groupId === assetGroup.id).map((object, i)=>{
                      return({
                        ...object,
                      })
                    })}
                    disabled={false}
                    onChange={handleToggleByArray(assetGroup.id)}
                    checkedItems={domainItems.filter(object => object.groupId === assetGroup.id)}
                    indexGetter={indexGetter}
                    labelGetter={row => row.value}
                    keyGetter={row => row.id}
                  >
                  </ExpandCheckboxSection>
                )
              })
            )}
            {sourceCategoryMap[selectedSource] && selectedSource !== sourceCategory.ASSET && (sourceCategoryMap[selectedSource] && sourceCategoryMap[selectedSource].map((object, i) => {
              return renderItem(false)(object, i);
            }))}
          </List>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  )
});

export default AxisCategory;
