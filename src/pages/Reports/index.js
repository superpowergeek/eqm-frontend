import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';

import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import Menu from 'components/shared/Table/Menu';
import StyledConfirmContent from 'components/shared/StyledConfirmContent';
import * as Selectors from 'selectors';
import types from '@constants/actions';
import CreateReportDialog from './CreateReportDialog';

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
  input: {
    height: 40,
    marginLeft: 24,
    width: '60%',
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

const Reports = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const reportIds = useSelector(Selectors.selectReportRecordIds);
  const reportIdMap = useSelector(Selectors.selectReportRecordIdMap);

  React.useEffect(() => {
    if (!reportIds) {
      dispatch({ type: types.GET_USER_REPORTS });
    }
  }, [dispatch, reportIds]);

  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);

  const [selectedItems, setSelectedItems] = React.useState([]);

  const onOpenTemplateDialog = () => setCreateDialogOpen(true);
  const onEdit = React.useCallback((row) => {
    dispatch(push(`/reports/${row.id}`))
  }, [dispatch]);

  const onDelete = React.useCallback((row) => {
    setSelectedItems([row.id]);
    setConfirmDialogOpen(true);
  }, []);

  const onClickTitle = React.useCallback((id) => () => {
    dispatch(push(`/reports/${id}`))
  }, [dispatch]);

  const tableData = React.useCallback({
    rows: (reportIds || []).map(id => reportIdMap[id]),
    columnSettings: [
      { key: 'name', label: 'Name', sortable: true, disablePadding: false, align: 'left',
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
  }, [reportIdMap, reportIds]);

  const closeConfirmDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const closeCreateDialog = React.useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_USER_REPORT,
      data: {
        itemIds: selectedItems
      },
    })
  }, [dispatch, selectedItems]);

  const toolBarOnDelete = React.useCallback((itemIds) => {
    setSelectedItems(itemIds);
    setConfirmDialogOpen(true);
  }, []);

  return (
    <FlexDiv container column fullHeight fullWidth className={classes.root} crossAlign="center" style={{ position: 'relative' }}>
      <AppBar />
      <PageHeader title="Reports">
        <Button variant="contained" className={classes.btn} onClick={onOpenTemplateDialog}>
          Add Report
        </Button>
      </PageHeader>
      <Paper square className={classes.content} elevation={2} style={{ minHeight: '100%' }}>
        <Table
          data={tableData}
          toolbarConfig={{
            title: 'Report List',
            onDelete: toolBarOnDelete,
          }}
        />
      </Paper>
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <StyledConfirmContent
          title={"Are you sure to delete selected reports ?"}
          onCancel={closeConfirmDialog}
          onConfirm={onClickRemove}
          confirmLabel={"Remove"}
        />
      </Dialog>
      <CreateReportDialog open={createDialogOpen} onClose={closeCreateDialog} />
    </FlexDiv>
  )
}

export default Reports;
