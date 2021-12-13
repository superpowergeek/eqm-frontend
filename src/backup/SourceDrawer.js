import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import types from '@constants/actions';
import { sourceCategory, chartTypes, chartTypesValueMap, categories, frequencies, pollutantItems, wasteItems } from '@constants';
import DateRangeFilter from 'components/shared/Filters/DateRangeFilter';
import ExpandSection from 'components/shared/ExpandSection';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import { onInputChange, updateStateComposer } from 'utils/functions';
import { useDateRangeState } from 'utils/hooks';
import * as Selectors from 'selectors';

const pollutants = Object.values(pollutantItems).map(v => v);
const wastes = Object.values(wasteItems).map(v => v);

const drawerWidth = 420;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
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
  drawerPaper: {
    width: drawerWidth,
    boxSizing: 'border-box',
    padding: 24,
    paddingTop: 84,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  categoryPaper: {
    display: 'flex',
    flexDirection: 'column',
    height: 240,
    overflowY: 'auto',
  },
  sourcePaper: {
    display: 'flex',
    flexDirection: 'column',
    height: 240,
    overflowY: 'auto',
    // padding: 12,
  },
}))

const SourceDrawer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
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
  const companyIdNameMap = useSelector(Selectors.selectCompanyIdMap) || {};
  const assetGroups = useSelector(Selectors.selectAssetGroups)[companyId] || {};
  const assetGroupCollection = assetGroups.collection || [];
  const assetsByGroupId = useSelector(Selectors.selectAssets);
  // const [checkSources, setCheckSources] = React.useState({ [companyId]: true });

  React.useEffect(() => {
    dispatch({ type: types.SET_CURRENT_CONFIG, data: { id: 'tmp' }});
  }, []);

  // const onChange = (setter, option) => (e) => {
  //   e.persist();
  //   setter(updateStateComposer(option, e.target.checked));
  // }

  const onReset = () => {
    setSourceCategoryMap({
      [sourceCategory.COMPANY]: [],
      [sourceCategory.ASSETGROUP]: [],
    })
    setCategoryMap({
      [categories.POLLUTANTS]: [],
      [categories.WASTE]: [],
    });
  }

  const onApply = () => {
    // const sources = Object.keys(checkSources).map(key => {
    //   if (checkSources[key]) return key;
    // }).filter(o => !!o);

    // if (sources.length === 0) return;
    dispatch({
      type: types.GET_ANALYTIC_DATA,
      data: {
        id: `tmp`,
        sources: [],
        range: { // temporary not work in create report
          beginDate: (beginDate && beginDate.format('x')) || null,
          endDate: (endDate && endDate.format('x')) || null,
        },
        frequency,
        sourceCategoryMap,
        categoryMap,
        chartType,
      }
    })
  }

  const itemIsCheck = React.useCallback((state, key, value) => {
    return state[key].indexOf(value) > -1;
  }, []);

  const onCheckChange = React.useCallback((setter, key, value) => () => {
    setter(prev => {
      const itemIndex = prev[key].indexOf(value);
      if (itemIndex > -1) {
        prev[key].splice(itemIndex, 1);
        return { 
          ...prev,
          [key]: [...prev[key]],
        };
      }
      return {
        ...prev,
        [key]: [ ...prev[key], value ],
      };
    })
  }, []);

  return (
    <Drawer
      anchor={"right"}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div>
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
          // handleClose={handleClose}
        />
        <FormInput 
          direction="row"
          compProps={{ inputContainer: { crossAlign: 'center' }}}
          label="Frequency"
          classes={{ container: classes.container, inputContainer: classes.inputContainer }}
        >
          <FlexDiv item grow />
          <Select variant="outlined" className={classes.input} value={frequency} onChange={onInputChange(setFrequency)}>
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
            <ExpandSection title="Pollutant" square subTitle={`${categoryMap[categories.POLLUTANTS].length} selected`}>
              <FlexDiv container column>
                {pollutants.map((value) => {
                  return (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox 
                          color="primary"
                          checked={itemIsCheck(categoryMap, categories.POLLUTANTS, value)}
                          onChange={onCheckChange(setCategoryMap, categories.POLLUTANTS, value)}
                        />
                      }
                      label={value}
                      labelPlacement="end"
                    />
                  )
                })}
              </FlexDiv>
            </ExpandSection>
            <ExpandSection title="Waste" square subTitle={`${categoryMap[categories.WASTE].length} selected`}>
              <FlexDiv container column>
                {wastes.map((value) => {
                  return (
                    <FormControlLabel
                      key={value}
                      control={
                        <Checkbox 
                          color="primary"
                          checked={itemIsCheck(categoryMap, categories.WASTE, value)}
                          onChange={onCheckChange(setCategoryMap, categories.WASTE, value)}
                        />
                      }
                      label={value}
                      labelPlacement="end"
                    />
                  )
                })}
              </FlexDiv>
            </ExpandSection>
          </Paper>
        </FormInput>
        <FormInput
          direction="column"
          label="Source"
          classes={{ container: classes.container }}
        >
          <Paper variant="outlined" elevation={2} className={classes.sourcePaper}>
            <ExpandSection title="Company" square subTitle={`${sourceCategoryMap[sourceCategory.COMPANY].length} selected`}>
              <FlexDiv container column>
                {companyIds.map(id => {
                  return (
                    <FormControlLabel
                      key={id}
                      control={
                        <Checkbox 
                          color="primary"
                          checked={itemIsCheck(sourceCategoryMap, sourceCategory.COMPANY, id)}
                          onChange={onCheckChange(setSourceCategoryMap, sourceCategory.COMPANY, id)}
                        />
                      }
                      label={id === companyId ? 'Internal' : companyIdNameMap[id]}
                      labelPlacement="end"
                    />
                  )
                })}
              </FlexDiv>
            </ExpandSection>
            <ExpandSection title="AssetGroup" square subTitle={`${sourceCategoryMap[sourceCategory.ASSETGROUP].length} selected`}>
              <FlexDiv container column fullWidth>
                {assetGroupCollection.map(assetGroup => {
                  const assets = assetsByGroupId[assetGroup.id] || {};
                  const assetCollection = assets.collection || [];
                  return (
                    <React.Fragment key={assetGroup.id}>
                      <FormControlLabel
                        key={assetGroup.id}
                        control={
                          <Checkbox 
                            color="primary"
                            checked={itemIsCheck(sourceCategoryMap, sourceCategory.ASSETGROUP, assetGroup.id)}
                            onChange={onCheckChange(setSourceCategoryMap, sourceCategory.ASSETGROUP, assetGroup.id)}
                          />
                        }
                        label={assetGroup.name}
                        labelPlacement="end"
                      />
                      <FlexDiv container column fullWidth>
                        <ExpandSection title="Asset" square subTitle={`${sourceCategoryMap[sourceCategory.ASSET].length} selected`}>
                          {assetCollection.map(asset => {
                            return (
                              <FormControlLabel
                                key={asset.id}
                                control={
                                  <Checkbox 
                                    color="primary"
                                    checked={itemIsCheck(sourceCategoryMap, sourceCategory.ASSET, asset.id)}
                                    onChange={onCheckChange(setSourceCategoryMap, sourceCategory.ASSET, asset.id)}
                                  />
                                }
                                label={asset.name}
                                labelPlacement="end"
                              />
                            )
                          })}
                        </ExpandSection>
                      </FlexDiv>
                    </React.Fragment>
                  )
                })}
              </FlexDiv>
            </ExpandSection>
          </Paper>
        </FormInput>
        <FlexDiv item row fullWidth mainAlign="center" style={{ marginTop: 24 }}>
          <Button color="primary" variant="outlined" onClick={onReset} style={{ marginRight: 24 }}>Reset</Button>
          <Button color="primary" variant="contained" onClick={onApply}>Apply</Button>
        </FlexDiv>
      </div>       
    </Drawer>
  )
}

export default SourceDrawer;