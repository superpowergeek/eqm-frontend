import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import { push } from 'connected-react-router';
import moment from "moment";

import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import Menu from 'components/shared/Table/Menu';
import ConfirmContent from 'components/shared/ConfirmContent';
import { analyticDetailCreator } from 'utils/dataParser';
import { toXlsx, exportFile } from 'utils/exportHelper';
import types from '@constants/actions';
import * as Selectors from 'selectors';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'rgb(244,247,249)',
  },
  content: {
    width: 'calc(100% - 72px)',
    margin: 24,
    marginLeft: 36,
    marginRight: 36,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
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
}));

const AnalyticReports = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const analyticReportIds = useSelector(Selectors.selectAnalyticReportIds);
  const analyticReportIdMap = useSelector(Selectors.selectAnalyticReportIdMap);
  const analyticDatas = useSelector(Selectors.selectAnalyticData);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const onEdit = React.useCallback((row) => {
    dispatch(push(`/analytics/${row.id}`))
  }, [dispatch]);

  const onDelete = React.useCallback((row) => {
    setSelectedItems([row.id]);
    setConfirmDialogOpen(true);
  }, []);

  const onDownload = React.useCallback((row) => {
    const data = analyticDatas[row.id];
    const { source } = row.config;
    const { sourceCategoryMap, subItems } = source;
    const rows = analyticDetailCreator(data, sourceCategoryMap, subItems);
    const xlsx = toXlsx(rows, [
      'timestamp',
      ...subItems,
      'source',
    ], {
      timestamp: timestamp => moment(timestamp).format('YYYY.MM.DD HH:mm:ss'),
    });
    exportFile(xlsx, `${row.name}-${moment().format('YYYYMMDDHHmmss')}`);
  }, [analyticDatas]);

  const onClickTitle = React.useCallback((id) => () => {
    dispatch(push(`/analytics/${id}`))
  }, [dispatch]);

  const tableData = React.useCallback({
    rows: analyticReportIds.filter(id => id !== 'tmp').map(id => analyticReportIdMap[id]),
    columnSettings: [
      { key: 'title', label: 'Title', sortable: true, disablePadding: false, align: 'left',
        renderElement: row =>
          (
            <Link color="textPrimary" onClick={onClickTitle(row.id)} variant="subtitle1" component="button">
              {row.name}
            </Link>
          )
      },
      { key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left', bodyCellProps: { useEllipsis: true }, },
      { key: 'lastUpdate', label: 'Updated Date', sortable: true, disablePadding: false, align: 'center', renderElement: row => moment(row.lastUpdate).format('ll HH:mm') },
      {
        key: '__ACTION__',
        label: 'Manipulation',
        sortable: false,
        align: 'center',
        renderElement: (row) => {
          const menuOptions = [
            {
              key: 'export',
              label: 'Download',
              onAction: onDownload,
            },
            {
              key: 'edit',
              label: 'Edit',
              onAction: onEdit,
            },
            {
              key: 'delete',
              label: 'Delete',
              onAction: onDelete,
            },
          ];
          return <Menu options={menuOptions} row={row} />;
        },
      },
    ],
    columnSelectMode: 'checkbox',
  }, [analyticReportIds, analyticReportIdMap, analyticDatas]);

  const closeConfirmDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_ANALYTIC_REPORT,
      data: {
        itemIds: selectedItems
      },
    })
  }, [dispatch, selectedItems]);

  const toolBarOnDelete = React.useCallback((itemIds) => {
    setSelectedItems(itemIds);
    setConfirmDialogOpen(true);
  }, []);

  const toolBarOnDownload = React.useCallback((itemIds) => {
    itemIds.forEach(id => {
      const analyticReport = analyticReportIdMap[id];
      onDownload(analyticReport);
    });
  }, [analyticReportIdMap, onDownload]);

  const onAddChart = () => {
    dispatch(push('/analytics/tmp'));
  }
  return (
    <FlexDiv container column fullHeight className={classes.root} fullWidth crossAlign="center" style={{ position: 'relative' }}>
      <AppBar />
      <PageHeader title="Analytics">
        <Button variant="contained" onClick={onAddChart} className={classes.btn}>
          Add Chart
        </Button>
      </PageHeader>
      <Paper square className={classes.content} elevation={2} style={{ minHeight: '100%' }}>
        <Table
          data={tableData}
          toolbarConfig={{
            title: 'Analytic List',
            onDelete: toolBarOnDelete,
            onDownload: toolBarOnDownload,
          }}
        />
      </Paper>
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <ConfirmContent
          title={"Are you sure to delete selected reports ?"}

          onCancel={closeConfirmDialog}
          onConfirm={onClickRemove}
          confirmLabel={"Remove"}
        />
      </Dialog>
    </FlexDiv>
  )
}

export default AnalyticReports;
