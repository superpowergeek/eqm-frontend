import React from 'react';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { OutlinedInput, Typography, Button, IconButton } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import NavigateBeforeRounded from '@material-ui/icons/NavigateBeforeRounded';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import FlexDiv from 'components/shared/FlexDiv';
import FormInput from 'components/shared/FormInput';
import DateRangeFilter from 'components/shared/Filters/DateRangeFilter';
import MultiSelects from 'components/shared/MultiSelects';
import { onInputChange } from 'utils/functions';
import { useDateRangeState, useMultiSelectState } from 'utils/hooks';
import types from '@constants/actions';
import { chartTypes, chartTypesValueMap, categories, frequencies, pollutantItems, wasteItems, sourceCategory, itemsPresentMap } from '@constants';
import { xAxisModes } from '@constants/chart';
import * as Selectors from 'selectors';
import BarChartA from 'components/Icons/BarChartA';
import BarChartB from 'components/Icons/BarChartB';
import LineChart from 'components/Icons/LineChart';

const pollutants = Object.values(pollutantItems).map(v => v);
const wastes = Object.values(wasteItems).map(v => v);

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  form: {
    paddingTop: 48,
  },
  container: {
    width: '100%',
    marginTop: 16,
    marginBottom: 16
  },
  selectContainer: {
    width: '100%',
    margin: 0
  },
  navigateBefore: {
    border: `1px ${theme.palette.primary.main} solid`,
    marginBottom: 24,
    position: 'absolute',
    top: 24,
    left: 24,
  },
  inputContainer: {
    paddingLeft: 24,
    paddingRight: 24,
  },
  input: {
    height: 40,
    marginLeft: 24,
    width: '60%',
  },
  btn: {
    height: 40,
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
  },
  dateRangeFilter: {
    paddingTop: 0,
  },
  multiSelects: {
    padding: '0!important',
    width: '60%'
  }
}));

const AddSimpleChart = (props) => {
  const { onClose } = props;
  const dispatch = useDispatch();
  const sourceOptions = useSelector(Selectors.selectCompanyIds);
  const companyIdMap = useSelector(Selectors.selectCompanyIdMap);
  const optionsMap = {};
  Object.keys(companyIdMap || []).forEach(key=>{
    optionsMap[key] = companyIdMap[key].name;
  })
  const [reportName, setReportName] = React.useState('');
  const [reportDesc, setReportDesc] = React.useState('');
  const [category, setCategory] = React.useState(categories.POLLUTANTS);
  const [frequency, setFrequency] = React.useState(frequencies.DAY);
  const [chartType, setChartType] = React.useState(chartTypes.LINE_CHART);
  const [rangeType, setRangeType] = React.useState("__EMPTY__");
  const [item, setItem] = React.useState('');
  const [beginDate, endDate, setBeginDate, setEndDate] = useDateRangeState(null, null);
  const [isAll, setIsAll, selectedOptions, setSelectedOptions] = useMultiSelectState(true, []);

  React.useEffect(() => {
    if (category === categories.POLLUTANTS) {
      setItem(pollutantItems.COX)  
    } else {
      setItem(wasteItems.GARBAGE)
    }
  }, [category, setItem]);
  
  const classes = useStyles();
  const onCancel = () => {
    onClose();
  }
  const onSave = () => {
    const subItems = [item];
    const companySources = (isAll ? sourceOptions : selectedOptions).map(id => ({ value: optionsMap[id], id, type: sourceCategory.COMPANY }));
    const data = {
      name: reportName,
      description: reportDesc,
      config: {
        source: {
          frequency,
          range: { // temporary not work in create report
            beginDate: (beginDate && beginDate.format('x')) || null,
            endDate: (endDate && endDate.format('x')) || null,
          },
          sourceCategoryMap: {
            [sourceCategory.COMPANY]: companySources,
            [sourceCategory.ASSETGROUP]: [],
            [sourceCategory.ASSET]: [],
          },
          categoryMap: {
            [categories.POLLUTANTS]: category === categories.POLLUTANTS ? subItems : [],
            [categories.WASTE]: category === categories.WASTE ? subItems : [],
          },
          subItems,
        },
        chart: {
          chartType,
          xAxisMode: xAxisModes.TIME,
          xAxisItems: [{ value: item }],
          domainItems: companySources,
          size: { w: 1, h: 1 },
          time: {
            begin: (beginDate && beginDate.format('x')) || null,
            end: (endDate && endDate.format('x')) || null,
          }
        }
      },
    };
    dispatch({
      type: types.ADD_ANALYTIC_REPORT,
      [WAIT_FOR_ACTION]: types.ADD_ANALYTIC_REPORT_SUCCESS,
      [ERROR_ACTION]: types.ADD_ANALYTIC_REPORT_ERROR,
      data,
    }).then(result => {
      dispatch({ 
        type: types.GET_ANALYTIC_DATA,
        data: {
          id: result.report.id,
          sourceConfig: data.config.source,
        },
      })
    });
    onClose();
  }
  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item xs={12} sm={8} md={8} lg={6} className={classes.form}>
        <FlexDiv container column fullWidth fullHeight>
          <Typography variant="h5" style={{ paddingLeft: 24 }}>Add Chart</Typography>
          <FormInput 
            label="Chart Name"
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
            <FlexDiv item grow />
            <OutlinedInput
              value={reportName}
              placeholder={"Pollutants by week"}
              onChange={onInputChange(setReportName)}
              className={classes.input}
            />
          </FormInput>
          <FormInput 
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Chart Description"
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
            <FlexDiv item grow />
            <OutlinedInput
              value={reportDesc}
              placeholder={"Pollutants by week for May"}
              onChange={onInputChange(setReportDesc)}
              className={classes.input}
            />
          </FormInput>
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
                  <MenuItem key={key} value={value}>{itemsPresentMap[value]}</MenuItem>
                )
              })}
            </Select>
          </FormInput>
          <FormInput
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Chart Type"
            classes={{ container: classes.selectContainer, inputContainer: classes.inputContainer }}
            >
            <FlexDiv item grow />
            <FlexDiv className={classes.input}>
              <LineChart value={chartType} onClick={() => setChartType (chartTypesValueMap[chartTypes.LINE_CHART]) }/>
              <BarChartA value={chartType} onClick={() => setChartType (chartTypesValueMap[chartTypes.BAR_CHART]) }/>
            </FlexDiv>
          </FormInput>
          <FormInput 
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Category"
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
            <FlexDiv item grow />
            <Select variant="outlined" className={classes.input} value={category} onChange={onInputChange(setCategory)}>
              {Object.entries(categories).map(([key, value]) => {
                return (
                  <MenuItem key={key} value={value}>{itemsPresentMap[value]}</MenuItem>
                )
              })}
            </Select>
          </FormInput>
          <FormInput 
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Item"
            classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
            <FlexDiv item grow />
            <Select variant="outlined" className={classes.input} value={item} onChange={onInputChange(setItem)}>
              {category === categories.WASTE && wastes.map((value, i) => {
                return (
                  <MenuItem key={`${value}-${i}`} value={value}>{itemsPresentMap[value]}</MenuItem>
                )
              })}
              {category === categories.POLLUTANTS && pollutants.map((value, i) => {
                return (
                  <MenuItem key={`${value}-${i}`} value={value}>{itemsPresentMap[value]}</MenuItem>
                )
              })}
            </Select>
          </FormInput>
          <FormInput 
            direction="row"
            compProps={{ inputContainer: { crossAlign: 'center' }}}
            label="Source"
            classes={{ container: classes.selectContainer, inputContainer: classes.inputContainer }}
          >
            <FlexDiv item grow />
            <MultiSelects 
              label="" 
              isAll={isAll}
              setIsAll={setIsAll}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              options={sourceOptions}
              optionsMap={optionsMap}
              className={classes.multiSelects}
            />
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
          <FlexDiv item grow />
          <FlexDiv item row fullWidth mainAlign="center" style={{ marginBottom: 32, marginTop: 120 }}>
            <Button color="primary" variant="outlined" onClick={onCancel} style={{ marginRight: 24 }}>Cancel</Button>
            <Button variant="contained" onClick={onSave} className={classes.btn}>Save</Button>
          </FlexDiv>
      </FlexDiv>
      </Grid>
    </Grid>
  )
}

export default AddSimpleChart;
