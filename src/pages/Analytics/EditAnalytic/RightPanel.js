import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import types from '@constants/actions';
import { sourceCategory, chartTypes, chartTypesValueMap, categories, frequencies, pollutantItems, wasteItems } from '@constants';
import DateRangeFilter from 'components/shared/Filters/DateRangeFilter';
import ExpandSection from 'components/shared/ExpandSection';
import ExpandCheckboxSection from 'components/shared/ExpandCheckboxSection';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import { onInputChange } from 'utils/functions';
import { useDateRangeState, usePrevious } from 'utils/hooks';
import * as Selectors from 'selectors';

const pollutants = Object.values(pollutantItems).map(v => v);
const wastes = Object.values(wasteItems).map(v => v);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    paddingTop: 84,
    boxSizing: 'border-box',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  container: {
    width: '100%',
  },
  dateRangeFilter: {
    padding: 0,
  },
  inputContainer: {
  },
  input: {
    height: 40,
    marginLeft: 24,
    width: '60%',
  },
  categoryPaper: {
    display: 'flex',
    flexDirection: 'column',
    height: 240,
    overflowY: 'auto',
  },
  assetHeading: {
    flexBasis: 'auto',
  },
  btn: {
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    }
  },
}))

const updateObjectWithUID = (object) => {
  return {
    ...object,
    uniqueId: `${object.type}-${object.id}`
  }
}

const RightPanel = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id: currentId } = useSelector(Selectors.selectAnalyticCurrentConfig);

  const isAdd = currentId === 'tmp';
  const analyticReports = useSelector(Selectors.selectAnalyticReportIdMap);
  const currentReport = analyticReports[currentId];
  const prevReport = usePrevious(currentReport);
  const [categoryMap, setCategoryMap] = React.useState({
    [categories.POLLUTANTS]: [],
    [categories.WASTE]: [],
  });

  const [sourceCategoryMap, setSourceCategoryMap] = React.useState({
    [sourceCategory.COMPANY]: [],
    [sourceCategory.ASSETGROUP]: [],
    [sourceCategory.ASSET]: [],
  })

  const [rangeType, setRangeType] = React.useState("__EMPTY__");
  const [chartType, setChartType] = React.useState(chartTypes.LINE_CHART);
  const [beginDate, endDate, setBeginDate, setEndDate] = useDateRangeState(null, null);
  const [frequency, setFrequency] = React.useState(frequencies.DAY);
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const companyIds = useSelector(Selectors.selectCompanyIds) || [];
  const companyIdMap = useSelector(Selectors.selectCompanyIdMap) || {};
  const assetGroups = useSelector(Selectors.selectAssetGroups)[companyId] || {};
  const assetGroupIds = assetGroups.ids || [];
  const assetGroupIdMap = assetGroups.idMap || {};
  const assetsByGroupId = useSelector(Selectors.selectAssets);

  React.useEffect(() => {
    if (currentReport && currentReport !== prevReport) {
      const { range, frequency, sourceCategoryMap, categoryMap } = currentReport.config.source;
      if (frequency) setFrequency(frequency);
      if (sourceCategoryMap) setSourceCategoryMap(sourceCategoryMap);
      if (categoryMap) setCategoryMap(categoryMap);
      if (range.beginDate) setBeginDate(moment(Number(range.beginDate)));
      if (range.endDate) setEndDate(moment(Number(range.endDate)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport, prevReport]);

  const onReset = () => {
    setSourceCategoryMap({
      [sourceCategory.COMPANY]: [],
      [sourceCategory.ASSETGROUP]: [],
      [sourceCategory.ASSET]: [],
    })
    setCategoryMap({
      [categories.POLLUTANTS]: [],
      [categories.WASTE]: [],
    });
  }

  const onApply = () => {
    if (currentId === 'tmp') {
      let hasSource = false;
      let hasCategory = false;
      Object.values(sourceCategoryMap).forEach(array => {
        if (array.length > 0) hasSource = true;
      });
      Object.values(categoryMap).forEach(array => {
        if (array.length > 0) hasCategory = true;
      });
      if (!hasSource || !hasCategory) {
        // TODO: Show alert dialog or use validation 
        console.warn('Will not aplly');
        return;
      }
      const newSourceCategoryMap = { ...sourceCategoryMap };
      newSourceCategoryMap[sourceCategory.ASSET] = newSourceCategoryMap[sourceCategory.ASSET].map(updateObjectWithUID);
      newSourceCategoryMap[sourceCategory.ASSETGROUP] = newSourceCategoryMap[sourceCategory.ASSETGROUP].map(updateObjectWithUID);
      newSourceCategoryMap[sourceCategory.COMPANY] = newSourceCategoryMap[sourceCategory.COMPANY].map(updateObjectWithUID);
      dispatch({
        type: types.ADD_TMP_ANALYTIC_REPORT,
        data: {
          id: currentId,
          config: {
            source: {
              range: {
                beginDate: (beginDate && beginDate.format('x')) || null,
                endDate: (endDate && endDate.format('x')) || null,
              },
              frequency,
              sourceCategoryMap: newSourceCategoryMap,
              categoryMap,
              subItems: Object.values(categoryMap).reduce((prev, curr) => prev.concat(curr), []),
            },
            chart: {
              chartType,
            }
          }
        }
      })
    }
    
    dispatch({
      type: types.UPDATE_CURRENT_CONFIG,
      data: {
        chartType,
      },
    })
  }

  const onCheckChange = React.useCallback((setter, key) => (items) => () => {
    setter(prev => {
      return {
        ...prev,
        [key]: [...items],
      }
    })
  }, []);

  const onCheckChangeAsset = (setter, key, groupId) => (items) => () => {
    setter(prev => {
      const updateItems = prev[key].filter(object => object.groupId !== groupId).concat(items);
      return {
        ...prev,
        [key]: updateItems,
      }
    });
  };

  const indexGetterForItem = (row) => (value) => {
    return row === value;
  };

  const companyIndexGetter = (row) => (value) => {
    // eslint-disable-next-line eqeqeq
    return row.id == value.id;
  }

  return (
    <Paper variant="outlined" elevation={3} className={classes.root}>
      <Typography variant="h6">Source Selector</Typography>
      <FormInput 
        direction="row"
        compProps={{ inputContainer: { crossAlign: 'center' }}}
        label="ChartType"
        classes={{ container: classes.container, inputContainer: classes.inputContainer }}
        >
        <FlexDiv item grow />
        <Select variant="outlined" className={classes.input} value={chartType} onChange={onInputChange(setChartType)}>
          {Object.entries(chartTypes).map(([key, value]) => {
            return (
              <MenuItem key={key} value={value}>{chartTypesValueMap[key]}</MenuItem>
            )
          })}
        </Select>
      </FormInput>
      <DateRangeFilter
        onBeginChange={setBeginDate}
        onEndChange={setEndDate}
        beginDate={beginDate}
        endDate={endDate}
        rangeType={rangeType}
        setRangeType={setRangeType}
        className={classes.dateRangeFilter}
        disabled={!isAdd}
      />
      <FormInput 
        direction="row"
        compProps={{ inputContainer: { crossAlign: 'center' }}}
        label="Frequency"
        classes={{ container: classes.container, inputContainer: classes.inputContainer }}
      >
        <FlexDiv item grow />
        <Select disabled={!isAdd} variant="outlined" className={classes.input} value={frequency} onChange={onInputChange(setFrequency)}>
          {Object.entries(frequencies).map(([key, value]) => {
            return (
              <MenuItem key={key} value={value}>{key}</MenuItem>
            )
          })}
        </Select>
      </FormInput>
      <FormInput
        direction="column"
        label="Categories"
        classes={{ container: classes.container }}
      >
        <Paper variant="outlined" elevation={2} className={classes.categoryPaper}>
          <ExpandCheckboxSection 
            title="Pollutant" 
            square 
            subTitle={`${categoryMap[categories.POLLUTANTS].length} selected`} 
            options={pollutants} 
            onChange={onCheckChange(setCategoryMap, categories.POLLUTANTS)} 
            disabled={!isAdd}
            checkedItems={categoryMap[categories.POLLUTANTS]}
            indexGetter={indexGetterForItem}
            labelGetter={row => row}
            keyGetter={row => row}
          >
          </ExpandCheckboxSection>
          <ExpandCheckboxSection 
            title="Waste" 
            square 
            subTitle={`${categoryMap[categories.WASTE].length} selected`}
            options={wastes}
            onChange={onCheckChange(setCategoryMap, categories.WASTE)}
            disabled={!isAdd}
            checkedItems={categoryMap[categories.WASTE]}
            indexGetter={indexGetterForItem}
            labelGetter={row => row}
            keyGetter={row => row}
          >
          </ExpandCheckboxSection>
        </Paper>
      </FormInput>
      <FormInput
        direction="column"
        label="Source"
        classes={{ container: classes.container }}
      >
        <Paper variant="outlined" elevation={2} className={classes.categoryPaper}>
           <ExpandCheckboxSection 
            title="Company" 
            square 
            subTitle={`${sourceCategoryMap[sourceCategory.COMPANY].length} selected`}
            options={companyIds.map(id => {
              return {
                id,
                value: companyIdMap[id].name,
                type:sourceCategory.COMPANY,
              }
            })}
            onChange={onCheckChange(setSourceCategoryMap, sourceCategory.COMPANY)}
            disabled={!isAdd}
            checkedItems={sourceCategoryMap[sourceCategory.COMPANY]}
            indexGetter={companyIndexGetter}
            labelGetter={row => row.value}
            keyGetter={row => row.id}
          >
          </ExpandCheckboxSection>
          <ExpandCheckboxSection 
            title="AssetGroup" 
            square 
            subTitle={`${sourceCategoryMap[sourceCategory.ASSETGROUP].length} selected`}
            options={assetGroupIds.map(id => {
              return {
                id,
                value: assetGroupIdMap[id].name,
                type: sourceCategory.ASSETGROUP,
              }
            })}
            onChange={onCheckChange(setSourceCategoryMap, sourceCategory.ASSETGROUP)}
            disabled={!isAdd}
            checkedItems={sourceCategoryMap[sourceCategory.ASSETGROUP]}
            indexGetter={companyIndexGetter}
            labelGetter={row => row.value}
            keyGetter={row => row.id}
          > 
          </ExpandCheckboxSection>
          <ExpandSection title="Asset" square subTitle={`${sourceCategoryMap[sourceCategory.ASSET].length} selected`}>
            {assetGroupIds.map(id => {
              const assetGroup = assetGroupIdMap[id];
              const assets = assetsByGroupId[assetGroup.id] || {};
              const assetIds = assets.ids || [];
              const assetIdMap = assets.idMap || {};
              return (
                <ExpandCheckboxSection 
                  title={assetGroup.name} 
                  square 
                  style={{ width: '100%' }} 
                  key={assetGroup.id}
                  options={assetIds.map(id => {
                    return {
                      id,
                      value: assetIdMap[id].name,
                      type: sourceCategory.ASSET,
                      groupId: assetGroup.id,
                    }
                  })}
                  onChange={onCheckChangeAsset(setSourceCategoryMap, sourceCategory.ASSET, assetGroup.id)}
                  disabled={!isAdd}
                  checkedItems={sourceCategoryMap[sourceCategory.ASSET].filter(object => object.groupId === assetGroup.id )}
                  indexGetter={companyIndexGetter}
                  labelGetter={row => row.value}
                  keyGetter={row => row.id}
                >
                </ExpandCheckboxSection>
              )
            })}
          </ExpandSection>
        </Paper>
      </FormInput>
      <FlexDiv item row fullWidth mainAlign="center" style={{ marginTop: 24 }}>
        <Button disabled={!isAdd} color="primary" variant="outlined" onClick={onReset} style={{ marginRight: 24 }}>Reset</Button>
        <Button color="primary" variant="contained" className={classes.btn} onClick={onApply}>Apply</Button>
      </FlexDiv>
    </Paper>
  )
}

export default RightPanel;
