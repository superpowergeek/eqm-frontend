import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Modal } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import PopoverFilter from 'components/shared/PopoverFilter';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/ConfirmContent';
import {
  useDateRangeState,
} from 'utils/hooks';
import { chartTypes } from '@constants';
import types from '@constants/actions';
import ChartDrawer from 'components/shared/ChartDrawer';

const useStyles = makeStyles(theme => ({
  filter: {
    paddingTop: 24,
    // paddingBottom: 8,
    height: 32,
    boxSizing: 'border-box',
  },
  chartContainer: {
    boxSizing: 'border-box',
    padding: 24,
  },
  iconBtn: {
    height: 48,
    width: 48,
  },
  isHidden: {
    visibility: 'hidden',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
  modalContent: {
    backgroundImage: 'linear-gradient(126deg, rgba(255, 144, 129, 0.8) 3%, #d9482d 56%)',
    opacity: 0.9,
  },
  title: {
    color: 'white',
    fontSize: 28
  },
  root: {
    height: 200,
    width: 480
  },
  description: {
    color: '#fff',
    fontSize: 12,
    marginTop: 16
  }
}));

const Section = React.memo((props) => {
  const { dataSet, row } = props;
  const { id, name, description, config } = row;
  const { chart: chartConfig, source } = config;
  const { chartType, domainItems } = chartConfig;
  const dispatch = useDispatch();
  const [beginDate, endDate, setBeginDate, setEndDate] = useDateRangeState(null, null);
  const [selectedSection, setSelectedSection] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const flexRef = React.useRef(null);
  // console.log(dataSet);

  const dateRangeFilter = React.useCallback((getTimestamp) => (row) => {
    let ok = true;
    if (beginDate && endDate) {
      ok = ok && moment(getTimestamp(row)).isBetween(beginDate, endDate);
    }
    return ok;
  }, [beginDate, endDate]);

  const dataFilter = React.useCallback((data) => {
    if (chartType !== chartTypes.LINE_CHART) return data;
    const filterRow = (row) => {
      let ok = true;
      // const { id } = row;
      // if (selectedSources.length !== 0) {
      //   const prefix = Number(companyNameMap[(id.split('-')[0])]);
      //   ok = ok && selectedSources.indexOf(prefix) > -1;
      // }
      // if (selectedItems.length !== 0) {
      //   const item = id.split('-')[1];
      //   ok = ok && selectedItems.indexOf(item) > -1;
      // }
      return ok;
    }
    return data.filter(filterRow);
  }, [chartType]);

  const otherPropsFilter = React.useCallback(others => {
    if (chartType !== chartTypes.BAR_CHART) return others;
    const { keys, ...lessOthers } = others;
    const filterRow = (row) => {
      let ok = true;
      // if (selectedSources.length !== 0) {
      //   const prefix = Number(companyNameMap[(row.split('-')[0])]);
      //   ok = ok && selectedSources.indexOf(prefix) > -1;
      // }
      // if (selectedItems.length !== 0) {
      //   const item = row.split('-')[1];
      //   ok = ok && selectedItems.indexOf(item) > -1;
      // }
      return ok;
    }

    return {
      keys: keys.filter(filterRow),
      ...lessOthers,
    }
  }, [chartType]);
  const [isHidden, setIsHidden] = React.useState(true);
  const onOver = React.useCallback(() => setIsHidden(false), [setIsHidden]);
  const onLeave = React.useCallback(() => setIsHidden(true), [setIsHidden]);

  const onApplyFilter = (obj) => {
    const { beginDate, endDate } = obj;
    if (beginDate || beginDate === null) setBeginDate(beginDate);
    if (endDate || endDate === null) setEndDate(endDate);
  }

  const classes = useStyles();

  const onDelete = React.useCallback((id) => (e) => {
    e.stopPropagation();
    setSelectedSection(id);
    setModalOpen(true);
  }, []);

  const onCloseModal = React.useCallback(() => {
    setModalOpen(false);
  },[]);

  const onConfirmModal = React.useCallback(() => {
    dispatch({
      type: types.DELETE_ANALYTIC_REPORT,
      data: {
        itemIds: [ selectedSection ],
      }
    })
    setModalOpen(false);
  }, [dispatch, selectedSection]);

  return (
    <FlexDiv container fullHeight fullWidth column onMouseOver={onOver} onMouseLeave={onLeave} ref={flexRef}>
      <FlexDiv container fullWidth>
        <Typography variant="h6" color="primary">{name}</Typography>
        <FlexDiv item grow />
        <IconButton onClick={onDelete(id)} className={clsx(classes.iconBtn, { [classes.isHidden]: isHidden })}>
          <Delete />
        </IconButton>
      </FlexDiv>
      <PopoverFilter
        actionText={"Section Filter"}
        values={{
          beginDate,
          endDate,
        }}
        className={classes.filter}
        isHidden={isHidden}
        onApply={onApplyFilter}
        anchorOrigin={{
          vertical: 44,
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      />
      <FlexDiv container crossAlign="center" mainAlign="center" fullHeight fullWidth className={classes.chartContainer}>
        <ChartDrawer
          dateRangeFilter={dateRangeFilter}
          dataFilter={dataFilter}
          otherPropsFilter={otherPropsFilter}
          chartConfig={chartConfig}
          dataSet={dataSet}
        />
      </FlexDiv>
      <Modal disableEnforceFocus disableAutoFocus open={modalOpen} container={() => flexRef.current} onClose={onCloseModal} className={classes.modal}>
        <FlexDiv container className={classes.modalContent} fullWidth fullHeight mainAlign="center" crossAlign="center">
          <ConfirmContent
            title={`Remove "${name || 'this chart'}" from Dashboard?`}
            confirmLabel={"Remove"}
            onCancel={onCloseModal}
            onConfirm={onConfirmModal}
            classes={{ title: classes.title, root: classes.root, description: classes.description }}
            description="Remember, once you remove it. it can't be recoverd."
            btnAlign='center'
          />
        </FlexDiv>
      </Modal>
    </FlexDiv>
  )
});

export default Section;
