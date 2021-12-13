import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Responsive, WidthProvider } from "react-grid-layout";
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
// import cloneDeep from 'lodash/cloneDeep';
import PopoverFilter from 'components/shared/PopoverFilter';
import FlexDiv from 'components/shared/FlexDiv';
import EmptyChart from 'components/shared/EmptyChart';
import NivoPie from 'components/Nivo/Pie';
import TargetBar from 'components/shared/TargetBar';
import { useDateRangeState } from 'utils/hooks';
import { pieDataCreater, numberWithCommas } from 'utils/functions';
import * as Selectors from 'selectors';
import SummarySection from './SummarySection';
import types from '@constants/actions';
import { pollutantItems } from '@constants';

const useStyles = makeStyles(theme => ({
  rootRGL: {
    width: '100%',
  },
  topSummary: {
    backgroundColor: 'rgb(244,247,249)',
    paddingLeft: 36,
    paddingRight: 36,
  },
  target: {
    fontFamily: "Helvetica Neue",
    fontWeight: 'bold',
    marginBottom: 4,
  },
  h5: {
    fontFamily: "Helvetica Neue",
    fontWeight: 300,
  },
  tooltip: {
    fontSize: 14,
  },
  totalContainer: {
    paddingTop: 16,
    boxSizing: 'border-box',
  },
  summaryItem: {
    backgroundColor: 'white',
    boxShadow: 'rgba(45, 62, 80, 0.12) 0px 1px 5px 0px',
    boxSizing: 'border-box',
    padding: 24,
  },
  h6: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '0.8rem',
    },
  }
}));

const RGL = WidthProvider(Responsive);

const topLayouts = { lg:
  [{
    w: 1,
    h: 1,
    x: 0,
    y: 0,
    i: 't1',
    static: true,
  },
  {
    w: 1,
    h: 1,
    x: 0,
    y: 1,
    i: 't2',
    static: true,
  },
  {
    w: 1,
    h: 2,
    x: 1,
    y: 0,
    i: 't3',
    static: true,
  },
  {
    w: 1,
    h: 2,
    x: 2,
    y: 0,
    i: 't4',
    static: true,
  },
  {
    w: 1,
    h: 2,
    x: 3,
    y: 0,
    i: 't5',
    static: true,
  },
  ]
}

const Summary = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [beginDate, endDate, setBeginDate, setEndDate] = useDateRangeState(null, null);

  // const totalSOx = useSelector(Selectors.selectTotalSOx);
  const totalCOx = useSelector(Selectors.selectTotalCOx) || 0;
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const pollutantSources = useSelector(Selectors.selectPollutantSources) || {};
  const selfCOx = (pollutantSources[companyId] && pollutantSources[companyId][pollutantItems.COX]) || 0;
  const percentOfSelfCOx = Number((selfCOx / 20000000 * 100).toFixed(0));
  const assignedCOx = totalCOx - selfCOx;
  const percentOfAssignedCOx = Number((assignedCOx / 20000000 * 100).toFixed(0));
  const companyIdMap = useSelector(Selectors.selectCompanyIdMap) || {};
  const companyNameIdMap = {};
  Object.keys(companyIdMap).forEach(key => {
    companyNameIdMap[key] = companyIdMap[key].name;
  });
  const piePM2_5 = pieDataCreater(pollutantSources, companyNameIdMap, pollutantItems.PM2_5);
  const piePM10 = pieDataCreater(pollutantSources, companyNameIdMap, pollutantItems.PM10);
  const pieNOx = pieDataCreater(pollutantSources, companyNameIdMap, pollutantItems.NOX);

  // const totalPM2_5 = useSelector(Selectors.selectTotalPM2_5);
  // const totalPM10 = useSelector(Selectors.selectTotalPM10);
  // const totalNOx = useSelector(Selectors.selectTotalNOx);

  // const dateFilter = useCallback((rows) => {
  //   if (beginDate === null || endDate === null) return rows;
  //   const filterDate = (getTimestamp) => (row) => {
  //     let ok = true;
  //     if (beginDate && endDate) {
  //       ok = ok && moment(getTimestamp(row)).isBetween(beginDate, endDate);
  //     }
  //     return ok;
  //   }
  //   return rows.filter(filterDate((r) => r.timestamp));
  // }, [beginDate, endDate]);


  const onApplyFilter = (obj) => {
    const { beginDate, endDate } = obj;
    setBeginDate(beginDate);
    setEndDate(endDate);
    dispatch({
      type: types.GET_SUMMARY_DATA,
      data: {
        range: beginDate && endDate && {
          beginDate: beginDate.format('x'),
          endDate: endDate.format('x'),
        },
      }
    })
  }
  return (
    <FlexDiv container fullWidth className={classes.topSummary} column>
      <FlexDiv container fullWidth crossAlign="center" height={52} style={{ paddingRight: 24, paddingLeft: 24 }}>
        <Typography variant="h6">Greenhouse Gas Emissions Summary</Typography>
        <FlexDiv item grow/>
        <PopoverFilter
          actionText="Summary Filter"
          values={{
            beginDate,
            endDate,
          }}
          withMultiSource={false}
          withMultiItem={false}
          onApply={onApplyFilter}
          className={classes.dateRangePopover}
          anchorOrigin={{
            vertical: 24,
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        />
      </FlexDiv>
      <RGL
        containerPadding={[24, 0]}
        margin={[30, 30]}
        layouts={topLayouts}
        cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
        rowHeight={160}
        className={clsx(classes.rootRGL, "layout")}
      >
        <FlexDiv key={"t1"} column className={classes.summaryItem}>
          <Typography variant="h6" className={classes.h6}>2020 Carbon Emissions</Typography>
          <Divider />
          <FlexDiv item column className={classes.totalContainer}>
            <Typography variant="h5" className={classes.h5}>Total Amount</Typography>
            <FlexDiv item crossAlign="baseline" fullWidth>
              <Typography variant="h5" className={classes.h5}>{totalCOx ? numberWithCommas((totalCOx / 1000).toFixed(2)) : '---'}</Typography>
              <Typography variant="body2" style={{ marginLeft: 16 }} >tons</Typography>
            </FlexDiv>
          </FlexDiv>

        </FlexDiv>
        <FlexDiv key={"t2"} column className={classes.summaryItem}>
          <Typography variant="h6" className={classes.h6}>2020 Carbon Emission Targets</Typography>
          <Divider />
          <FlexDiv item column className={classes.totalContainer}>
            <FlexDiv column fullWidth>
              <FlexDiv row>
                <Typography variant="body2" className={classes.target}>Scope 1, 2 </Typography>
                <FlexDiv item grow />
                <Typography variant="body2" className={classes.target}>{`${percentOfSelfCOx}% consumed`}</Typography>
              </FlexDiv>
              <Tooltip title={`${selfCOx.toFixed(1)} / 20000000 `} arrow classes={{ tooltip: classes.tooltip }}>
                <FlexDiv item>
                  <TargetBar value={percentOfSelfCOx} />
                </FlexDiv>
              </Tooltip>
            </FlexDiv>
            <FlexDiv column fullWidth style={{ marginTop: 12 }}>
              <FlexDiv row>
                <Typography variant="body2" className={classes.target}>Scope 3 </Typography>
                <FlexDiv item grow />
                <Typography variant="body2" className={classes.target}>{`${percentOfAssignedCOx}% consumed`}</Typography>
              </FlexDiv>
              <Tooltip title={`${assignedCOx.toFixed(1)} / 20000000 `} arrow classes={{ tooltip: classes.tooltip }}>
                <FlexDiv item>
                  <TargetBar value={percentOfAssignedCOx} />
                </FlexDiv>
              </Tooltip>
            </FlexDiv>
            {/* <FlexDiv column fullWidth>
              <Typography variant="subtitle1" className={classes.h5}>Scope 3</Typography>
              <FlexDiv item crossAlign="baseline">
                <Typography variant="h5" className={classes.h5}>{assignedCOx ? numberWithCommas((assignedCOx / 1000 || 0).toFixed(2)) : '---'}</Typography>
                <Typography variant="h5" className={classes.h5}>{'/ 20,000'}</Typography>
                <Typography variant="body2" style={{ marginLeft: 16 }}>tons</Typography>
              </FlexDiv>
            </FlexDiv> */}
          </FlexDiv>
        </FlexDiv>
        {/* <FlexDiv key={"t2"} column className={classes.summaryItem}>
          <Typography variant="h6">Sulfur (SOx)</Typography>
          <Divider />
          <FlexDiv item column className={classes.totalContainer}>
            <Typography variant="h5" className={classes.h5}>Total Amount</Typography>
            <FlexDiv item crossAlign="baseline" fullWidth>
              <Typography variant="h5" className={classes.h5}>{totalSOx ? numberWithCommas((totalSOx || 0).toFixed(2)) : '---'}</Typography>
              <Typography variant="body2" style={{ marginLeft: 16 }}>gram</Typography>
            </FlexDiv>
          </FlexDiv>
        </FlexDiv> */}
        <FlexDiv key={"t3"} column className={classes.summaryItem}>
          <SummarySection title={"Total Nitrous (NOx g)"}>
            <NivoPie
              renderEmpty={EmptyChart}
              data={pieNOx} />
          </SummarySection>
        </FlexDiv>
        <FlexDiv key={"t4"} column className={classes.summaryItem}>
          <SummarySection title={"Total Particulate (PM2.5 g)"}>
            <NivoPie
              renderEmpty={EmptyChart}
              data={piePM2_5} />
          </SummarySection>
        </FlexDiv>
        <FlexDiv key={"t5"} column className={classes.summaryItem}>
          <SummarySection title="Total Particulate (PM10 g)">
            <NivoPie
              renderEmpty={() =>
                <FlexDiv fullHeight container mainAlign="center" crossAlign="center">
                  <Typography variant="body1" color="primary">
                    There is no data in selected time interval
                  </Typography>
                </FlexDiv>
              }
              data={piePM10} />
          </SummarySection>
        </FlexDiv>
      </RGL>
    </FlexDiv>
  )
}

export default Summary;
