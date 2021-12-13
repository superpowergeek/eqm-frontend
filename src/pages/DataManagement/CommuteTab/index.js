import React, {useState} from 'react';
import moment from 'moment';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

import {commuteTypesMap} from '@constants';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/StyledConfirmContent';
import {usePrevious} from 'utils/hooks';
import CommuteTableDialog from './CommuteTableDialog';
import EditIcon from "@material-ui/icons/Edit";
import TableTabs from "../TableTabs";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 24,
  },
  root: {
    width: '100%',
    backgroundColor: 'rgb(244,247,249)'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  paperContent: {
    border: 'none',
    boxShadow: 'rgba(193, 203, 208, 0.56) 0 1px 4px 1px ',
    marginLeft: 36,
    marginRight: 36
  }
}));

const CommuteTab = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const commuteByCompanyId = useSelector(Selectors.selectCommutes) || {};
  const commutes = commuteByCompanyId[companyId] || {};
  const prevCommuteIds = usePrevious(commutes.ids);
  const [commuteRows, setCommuteRows] = React.useState([]);

  React.useEffect(() => {
    if (commutes.ids && prevCommuteIds !== commutes.ids) {
      setCommuteRows(commutes.ids.map(id => commutes.idMap[id]));
    }
  }, [prevCommuteIds, commutes.ids, commutes.idMap]);

  React.useEffect(() => {
    if (commutes.ids) return;
    dispatch({ type: types.GET_COMPANY_COMMUTE });
  }, [commutes.ids, dispatch]);

  const [commuteDialogOpen, setCommuteDialogOpen] = useState(false);
  const [commuteDetails, setCommuteDetails] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  const closeConfirmDialog = React.useCallback(() => {
    setCommuteDialogOpen(false);
  }, []);

  const onAdd = () => {
    setCommuteDialogOpen(true);
    setCommuteDetails([]);
  }

  const handleEdit = (row) => () => {
    setCommuteDialogOpen(true);
    row.commutes.forEach(commute => {
      commute.percent = commute.percent * 100;
    })
    setCommuteDetails(row.commutes);
  }

  const classes = useStyles();

  const closeConfirmDeleteDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_COMPANY_COMMUTE,
      data: {
        recordId: selectedId
      }
    })
  }, [dispatch, selectedId]);

  const handleDelete = (rowId) => () => {
    setSelectedId(rowId);
    setConfirmDialogOpen(true);
  };


  const expandedTableData = {
    rows: commuteRows,
    columnSettings: [
      { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left', },
      { key: 'deprecatedDate', label: 'Deprecated Date', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.deprecatedDate ? moment(row.deprecatedDate).format('YYYY-MM-DD HH:mm') : ''},
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          return (
              <React.Fragment>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete(row.id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
          )
        },
      },
    ]
  };

  const renderTableExpand = React.useCallback((row) => {
    const { commutes = [] } = row;
    const expandedTableData = {
      rows: commutes,
      columnSettings: [
        { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') },
        { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
          bodyCellProps: {
            useEllipsis: true,
          },
          renderElement: row => {return row.country.name;}
        },
        { key: 'type', label: 'Commute Type', sortable: true, disablePadding: false, align: 'left',
          renderElement: row => commuteTypesMap[row.type]
        },
        { key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left', bodyCellProps: {useEllipsis: true,}, },
        { key: 'averageDistance', label: 'Distance', sortable: true, disablePadding: false, align: 'left', renderElement: row => `${row.averageDistance}(km)`},
        { key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.percent * 100 },

      ],
    }

    return (
        <FlexDiv>
          <Table
              data={expandedTableData}
              selectMode="single"
              defaultRowsPerPage={5}
          />
        </FlexDiv>
    )
  }, []);

  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{ minHeight: '100%' }} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          <TableTabs value={3}/>
          <FlexDiv row fullWidth fullHeight>
            <FlexDiv item fullHeight style={{ flex: 3 }}>
              <Table
                  toolbarConfig={{
                    title: 'Employee Commutes',
                    onAdd: onAdd,
                  }}
                  data={expandedTableData}
                  expand={{
                    position: 'left',
                    renderExpand: renderTableExpand,
                  }}
              />
            </FlexDiv>
            <CommuteTableDialog open={commuteDialogOpen} onClose={closeConfirmDialog} commutes={commuteDetails}></CommuteTableDialog>
          </FlexDiv>
        </Paper>
        <Dialog open={confirmDialogOpen} onClose={closeConfirmDeleteDialog}>
          <ConfirmContent
            title={"Are you sure to delete selected commute record ?"}
            onCancel={closeConfirmDeleteDialog}
            onConfirm={onClickRemove}
            confirmLabel={"Remove"}
          />
        </Dialog>
      </FlexDiv>
    </FlexDiv>
  )
}

export default CommuteTab;
