import 'styles/resize.css';
import 'styles/grid.css';

import React, { useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import clsx from "clsx";

import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Summary from 'containers/Summary';
import SectionChart from 'containers/Section';
import * as Selectors from 'selectors';
import { getLocationFromOrder } from 'utils/locationHelper';
import AddSimpleChart from './AddSimpleChart';
import FirstChart from 'components/shared/FirstChart';



const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'rgb(244,247,249)',
  },
  rootRGL: {
    width: '100%',
  },
  dateRangePopover: {
    paddingLeft: 24,
  },
  containerRGL: {
    padding: 24,
    paddingTop: 0,
    marginTop:0,
    marginBottom: 12
  },
  item: {
    backgroundColor: 'white',
    boxShadow: 'rgba(45, 62, 80, 0.12) 0px 1px 5px 0px',
    cursor: 'grab',
    boxSizing: 'border-box',
    padding: 24,
    '&:hover': {
      boxShadow: 'rgba(45, 62, 80, 0.24) 0px 1px 10px 0px',
    },
  },
  hr: {
    height: 0,
    border: '1px solid #ddd',
    width: '90%',
    marginTop: 36,
    marginBottom: 0
  },
  firstChart: {
    height: 360,
    backgroundColor: 'white',
    boxShadow: 'rgba(45, 62, 80, 0.12) 0px 1px 5px 0px',
    cursor: 'grab',
    boxSizing: 'border-box',
    padding: 24,
    margin: 36,
    marginTop: 0,
    paddingTop: 0,
    '&:hover': {
      boxShadow: 'rgba(45, 62, 80, 0.24) 0px 1px 10px 0px',
    }
  },
  paper: {
    maxWidth: '100%',
    width: '80%',
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
  helpIcon: {
    position: 'fixed'
  }
}));

const RGL = WidthProvider(Responsive);

const defaultConfig = {
  w: 1,
  h: 1,
  maxW: 2,
  maxH: 2,
}

const Dashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const analyticReportIds = useSelector(Selectors.selectAnalyticReportIds);
  const analyticReportIdMap = useSelector(Selectors.selectAnalyticReportIdMap);
  const chartsArray = useSelector(Selectors.selectUserDashboard);
  const reportDatas = useSelector(Selectors.selectAnalyticData);
  const userId = useSelector(Selectors.selectUserId);
  const lg = chartsArray.map((chart, index) => {
    const { location, size, reportId, ...other } = chart;
    if (!location) {
      const { x, y } = getLocationFromOrder(index);
      return {
        ...defaultConfig,
        ...other,
        ...size,
        i: String(reportId),
        x,
        y,
      }
    }
    return {
      ...defaultConfig,
      ...other,
      ...location,
      ...size,
      i: String(reportId),
    }
  })
  const layouts = { lg };
  const saveLayout = useCallback(
    debounce(
      (layouts) => {
        let newChartsArray = []
        layouts.forEach((layout) => {
          const { i, x, y, w, h } = layout;
          // eslint-disable-next-line eqeqeq
          const index = analyticReportIds.findIndex(id => id == i );
          if (index > -1){
            newChartsArray.push({
              reportId: parseInt(i,10),
              location: { x, y},
              size: { w, h},
            })
          }
        });
        dispatch({
          type: types.UPDATE_USER,
          data: {
            value: JSON.stringify(newChartsArray),
            field: 'dashboard',
            id: userId,
          },
          [WAIT_FOR_ACTION]: types.UPDATE_USER_SUCCESS,
          [ERROR_ACTION]: types.UPDATE_USER_ERROR,
        }).then(re => console.log('update dashboard success'));
      },
      3000),
    [dispatch, chartsArray, analyticReportIds]);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const onCloseDialog = () => {
    setDialogOpen(false);
  }
  const handleAddChart = () => {
    setDialogOpen(true);
  }
  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Dashboard">
        <Button variant="contained" onClick={handleAddChart} className={classes.btn}>
          Add Chart
        </Button>
      </PageHeader>
      <Summary />
      <hr className={classes.hr}/>
      <FlexDiv container column fullWidth className={classes.containerRGL}>
      {chartsArray?.length ? (
        <RGL
          containerPadding={[36, 36]}
          margin={[30, 30]}
          layouts={layouts}
          cols={{ lg: 2, md: 2, sm: 1, xs: 1, xxs: 1 }}
          rowHeight={460}
          className={clsx(classes.rootRGL, "layout")}
          onDragStop={saveLayout}
          onResizeStop={saveLayout}
          >
          {chartsArray.map(({ reportId }) => {
            return (
              <FlexDiv key={reportId} column className={classes.item}>
                {analyticReportIdMap[reportId] &&
                  <SectionChart
                    row={analyticReportIdMap[reportId]}
                    dataSet={reportDatas[reportId]}
                  />
                }
              </FlexDiv>
            )
          })
          }
        </RGL>) : (
        <FlexDiv column className={classes.firstChart}>
          <FirstChart onClick={handleAddChart}/>
        </FlexDiv>
        )
      }
      </FlexDiv>
      <Dialog open={dialogOpen} onClose={onCloseDialog} classes={{ paperWidthSm: classes.paper }}>
        <AddSimpleChart onClose={onCloseDialog} />
      </Dialog>
    </FlexDiv>
  )
}
export default Dashboard;
