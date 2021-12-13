import React from 'react';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import { makeStyles, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import RadioGroup from "@material-ui/core/RadioGroup";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import SimpleTemplate from 'pages/Reports/simpleTemplate';
import FlexDiv from 'components/shared/FlexDiv';
import StyledRadio from 'components/shared/StyledRadio';
import FormInput from 'components/shared/FormInput';
import { draftObjectConvertor } from 'utils/frameworkTemplateHelper';

const useStyles = makeStyles((theme) => ({
  templateContainer: {
    width: '100%',
    padding: 48,
  },
  input: {
    height: 40,
    width: '100%'
  },
  body2: {
    color: lighten(theme.palette.text.primary, 0.2),
  },
  btn: {
    height: 40,
    fontSize: '1rem',
    textTransform: 'unset',
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
  },
}))
const CreateReportDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const [reportName, setReportName] = React.useState('');
  const [selectFramework, setSelectFramework] = React.useState('Simple');

  const frameworks = useSelector(Selectors.selectFrameworks);
  const frameworkCategoryByCompanyId = useSelector(Selectors.selectFrameworkCategory);
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const metrics = useSelector(Selectors.selectMetric);

  const metricIdMap = metrics[companyId]?.metricIdMap || {};

  const onChange = (setter) => (e) => {
    if (e.persist) e.persist();
    setter(e.target.value);
  };

  const onChangeTemplate = (event) => {
    setSelectFramework(event.target.value);
  }

  const onAddReport = async () => {
    let rawContent = '';
    let frameworkName;
    if (selectFramework === 'Simple') {
      rawContent = SimpleTemplate;
      frameworkName = 'Simple';
    } else {
      const frameworkId = selectFramework;
      // eslint-disable-next-line eqeqeq
      frameworkName = frameworks.filter(row => row.id == frameworkId)[0].name;
      let currentMetricIdMap = metricIdMap;
      let currentFrameworkCategory = frameworkCategoryByCompanyId[companyId]?.[frameworkId];
      if (!currentFrameworkCategory) {
        const { collection: frameworkCategories } = await dispatch({
          type: types.GET_FRAMEWORK_CATEGORIES,
          data: { frameworkId, companyId },
          [WAIT_FOR_ACTION]: types.GET_FRAMEWORK_CATEGORIES_SUCCESS,
          [ERROR_ACTION]: types.GET_FRAMEWORK_CATEGORIES_ERROR,
        })
        currentFrameworkCategory = frameworkCategories.reduce((prev, curr) => {
          prev.ids.push(curr.id);
          prev.idMap[curr.id] = curr;
          return prev;
        }, { ids: [], idMap: {} });
      }
      // make SDG metric always updated
      if (!currentMetricIdMap || frameworkId !== 1) {
        const { collection: metrics } = await dispatch({
          type: types.GET_COMPANY_METRICS,
          data: {
            frameworkId,
            companyId,
            calculated: true,
          },
          [WAIT_FOR_ACTION]: types.GET_COMPANY_METRICS_SUCCESS,
          [ERROR_ACTION]: types.GET_COMPANY_METRICS_ERROR,
        })
        metrics.forEach(metric => {
          currentMetricIdMap[metric.metricId] = metric;
        });
      }
      rawContent = draftObjectConvertor(frameworkId, currentFrameworkCategory, currentMetricIdMap)
    }
    
    const { report } = await dispatch({
      type: types.ADD_USER_REPORT,
      [WAIT_FOR_ACTION]: types.ADD_USER_REPORT_SUCCESS,
      [ERROR_ACTION]: types.ADD_USER_REPORT_ERROR,
      data: {
        name: reportName,
        description: `${frameworkName} framework`,
        content: JSON.stringify(rawContent),
      }
    })
    dispatch(push(`/reports/${report.id}`));
  }
  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <FlexDiv container column className={classes.templateContainer}>
        <FlexDiv row container crossAlign="center">
          <Typography variant="h5">Create Report</Typography>
          <FlexDiv item grow />
          <IconButton onClick={props.onClose}>
            <Close />
          </IconButton>
        </FlexDiv>
        <FormInput
          direction="column"
          compProps={{ inputContainer: { crossAlign: 'start' }}}
          label="Report Name"
          classes={{ container: classes.container, inputContainer: classes.inputContainer }}
          >
          <FlexDiv item grow />
          <OutlinedInput
            startAdornment={
              <InputAdornment position="start">
                <Edit />
              </InputAdornment>
            }
            value={reportName}
            placeholder={`What's the name of the report?`}
            type='text'
            onChange={onChange(setReportName)}
            className={classes.input}
          />
        </FormInput>
        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>Choose framework</Typography>
        <Typography variant="body2" className={classes.body2}>
          The days of creating reports from scratch are long gone. 
          To make your life easier you can choose a sustaninability report framework below as a starting point
        </Typography>
        <RadioGroup name="Framework" value={selectFramework} onChange={onChangeTemplate}>
          <FormControlLabel key={'Simple'} value={'Simple'} control={<StyledRadio />} label={'Simple'} />
          {
            frameworks.map(({ id, name }) => {
              return (
                <FormControlLabel key={name} value={String(id)} control={<StyledRadio />} label={name} />
              )
            })
          }
        </RadioGroup>
        <FlexDiv item row fullWidth mainAlign="end" style={{ marginTop: 24 }}>
          <Button color="primary" variant="outlined" onClick={props.onClose} style={{ marginRight: 24 }}>Cancel</Button>
          <Button color="primary" variant="contained" className={classes.btn} onClick={onAddReport}>Create</Button>
        </FlexDiv>
      </FlexDiv>
    </Dialog>
  )
}

export default CreateReportDialog;
