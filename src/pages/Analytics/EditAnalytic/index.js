import React from 'react';
import { replace } from 'connected-react-router';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ToggleButton from '@material-ui/lab/ToggleButton';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ListIcon from '@material-ui/icons/List';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import BearIcon from 'components/Icons/Bear';
import AppBar from 'containers/AppBar';
import FlexDiv from 'components/shared/FlexDiv';
import ChartDrawer from 'components/shared/ChartDrawer';
import AnalyticTable from 'components/shared/AnalyticTable';
import types from '@constants/actions';
import { onInputChange } from 'utils/functions';
import * as Selectors from 'selectors';
import AxisOption from './AxisOption';
import ItemOption from './ItemOption';
import RightPanel from './RightPanel';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    margin: 12,
  },
  titleInput: {
    width: '100%',
    paddingRight: 48,
    boxSizing: 'border-box',
  },
  descInput: {
    width: '100%',
  },
  rightPanel: {
    order: 2,
    position: 'fixed',
    right: 0,
    minWidth: 400,
    height: '100vh',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      order: 0,
      position: 'relative',
    },
  },
  toggleDiv: {
    alignSelf: 'flex-end',
    padding: 12,
    height: 72,
    boxSizing: 'border-box',
  },
  btn: {
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    }
  }
}));

const AddChartPage = (props) => {
  const { id } = props.match.params;
  const reportIdMap = useSelector(Selectors.selectAnalyticReportIdMap);
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentConfig = useSelector(Selectors.selectAnalyticCurrentConfig);
  const currentDatas = useSelector(Selectors.selectAnalyticCurrentDataObject);
  React.useEffect(() => {
    dispatch({ type: types.SET_CURRENT_CONFIG, data: { id }});
  }, [dispatch, id]);

  React.useEffect(() => {
    if (!reportIdMap || id === 'tmp') return;
    const analyticReport = reportIdMap[id]
    if (!analyticReport) return dispatch(replace('/analytics'));
    const { chart } = analyticReport.config;
    console.log(chart);
    dispatch({ type: types.SET_CURRENT_CONFIG,
      data: {
        id,
        ...chart,
      }
    });
    setName(analyticReport.name);
    setDesc(analyticReport.description);
  }, [dispatch, id, reportIdMap]);

  const onCancel = () => {
    dispatch({
      type: types.CLEAR_CURRENT_CONFIG,
    });
    dispatch(replace('/analytics'));
  };

  const onCreate = () => {
    // create a analytic chart/report
    const { id, ...others } = currentConfig;
    const { config } = reportIdMap[id];
    config.chart = {
      ...config.chart,
      ...others,
    };
    if (id !== 'tmp') {
      dispatch({
        type: types.UPDATE_ANALYTIC_REPORT,
        [WAIT_FOR_ACTION]: types.UPDATE_ANALYTIC_REPORT_SUCCESS,
        [ERROR_ACTION]: types.UPDATE_ANALYTIC_REPORT_ERROR,
        data: {
          id,
          payload: {
            name,
            description: desc,
            content: JSON.stringify(config),
          }
        }
      }).then(result => {
        dispatch(replace('/analytics'));
      })
      return;
    }

    dispatch({
      type: types.ADD_ANALYTIC_REPORT,
      [WAIT_FOR_ACTION]: types.ADD_ANALYTIC_REPORT_SUCCESS,
      [ERROR_ACTION]: types.ADD_ANALYTIC_REPORT_ERROR,
      data: {
        name,
        description: desc,
        config,
      }
    }).then(result => {
      dispatch(replace('/analytics'));
    })
  };

  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [toggleValue, setToggleValue] = React.useState('chart');
  const handleToggleChange = React.useCallback((event, newContent) => {
    if (!newContent) return;
    setToggleValue(newContent);
  },[]);
  if (currentConfig.id !== id) return null;
  return (
    <Grid container>
      <AppBar />
      <Grid item xs={12} md={8} lg={9} style={{ order: 1, paddingTop: 84 }}>
        {!!reportIdMap[id]?.config.source && <FlexDiv item grow fullHeight column>
          <Typography variant="h4" style={{ paddingLeft: 60, paddingTop: 24 }}>Analytics</Typography>
          <Paper elevation={2} style={{ margin: 60, marginTop: 24 }}>
            <FlexDiv container row fullWidth style={{ padding: 24 }}>
              <FlexDiv item grow>
                <TextField
                  label="Name"
                  value={name}
                  placeholder={"Pollutants by week, Range from 2018 to 2020"}
                  onChange={onInputChange(setName)}
                  className={classes.titleInput}
                />
              </FlexDiv>
              <FlexDiv item grow>
                <TextField
                  label="Description"
                  value={desc}
                  placeholder={"Description Detail Of Chart ..."}
                  onChange={onInputChange(setDesc)}
                  className={classes.descInput}
                />
              </FlexDiv>
            </FlexDiv>
            <Divider />
            <FlexDiv height={400} fullWidth column style={{ padding: 24 }}>
              <FlexDiv item className={classes.toggleDiv}>
                <ToggleButtonGroup
                  value={toggleValue}
                  exclusive
                  onChange={handleToggleChange}
                >
                  <ToggleButton value="chart">
                    <EqualizerIcon />
                  </ToggleButton>
                  <ToggleButton value="table">
                    <ListIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </FlexDiv>
              <FlexDiv item grow fullWidth fullHeight>
                {toggleValue === 'chart' && (
                  <ChartDrawer
                    chartConfig={currentConfig}
                    dataSet={currentDatas}
                  />
                )}
                {toggleValue === 'table' && (
                  <AnalyticTable
                    sourceConfig={reportIdMap[id] && reportIdMap[id].config.source}
                    dataSet={currentDatas}
                  />)}
              </FlexDiv>
            </FlexDiv>
            <Divider />
            <FlexDiv container row fullWidth style={{ minHeight: 420, padding: 24 }}>
              <Grid container>
                <Grid item xs={12} sm={12} md={6}>
                  <AxisOption />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <ItemOption />
                </Grid>
              </Grid>
            </FlexDiv>
            <FlexDiv item row fullWidth mainAlign="center" style={{ padding: 24 }}>
              <Button color="primary" variant="outlined" onClick={onCancel} style={{ marginRight: 24 }}>Cancel</Button>
              <Button color="primary" variant="contained" className={classes.btn} onClick={onCreate}>{id === 'tmp' ? 'Create Chart' : 'Update Chart'}</Button>
            </FlexDiv>
          </Paper>
        </FlexDiv>}
        {!reportIdMap[id]?.config.source && (
          <FlexDiv container fullHeight fullWidth column mainAlign="center" crossAlign="center">
            <FlexDiv item column style={{ transform: 'translateY(-40px)'}} mainAlign="center" crossAlign="center">
              <BearIcon style={{ fontSize: 240 }} />
              <Typography variant="h6">It's cold as North Pole in here!</Typography>
              <Typography variant="h6">There's no data yet, start adding now!</Typography>
              <Typography variant="body2" style={{ marginTop: 24, color: '#ef5423' }}>Use the sidebar on the right</Typography>
            </FlexDiv>
          </FlexDiv>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={4} className={classes.rightPanel}>
        <RightPanel />
      </Grid>
    </Grid>
  )
}

export default AddChartPage;
