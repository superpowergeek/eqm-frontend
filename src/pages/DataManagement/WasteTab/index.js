import React, {useState} from 'react';
import moment from 'moment';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

import {companyWasteTypesMap} from '@constants';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/StyledConfirmContent';
import {usePrevious} from 'utils/hooks';
import WasteTableDialog from './WasteTableDialog';
import EditIcon from "@material-ui/icons/Edit";
import TableTabs from "../TableTabs";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'rgb(244,247,249)'
  },
  content: {
    padding: 24,
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

const WasteTab = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const wasteByCompanyId = useSelector(Selectors.selectCompanyWaste) || {};
  const wastes = wasteByCompanyId[companyId] || {};
  const prevWasteIds = usePrevious(wastes.ids);
  const [wasteRows, setWasteRows] = React.useState([]);

  React.useEffect(() => {
    if (wastes.ids && prevWasteIds !== wastes.ids) {
      setWasteRows(wastes.ids.map(id => wastes.idMap[id]));
    }
  }, [prevWasteIds, wastes.ids, wastes.idMap]);

  React.useEffect(() => {
    if (wastes.ids) return;
    dispatch({ type: types.GET_COMPANY_WASTE });
  }, [dispatch, wastes.ids]);

  const [wasteDialogOpen, setWasteDialogOpen] = useState(false);
  const [wasteDetails, setWasteDetails] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  const closeConfirmDialog = React.useCallback(() => {
    setWasteDialogOpen(false);
  }, []);

  const onAdd = () => {
    setWasteDialogOpen(true);
    setWasteDetails([]);
  }

  const handleEdit = (row) => () => {
    setWasteDialogOpen(true);
    const wastes = [];
    Object.keys(row).forEach((key, index) => {
      if (key.includes("Percent") && row[key] != 0) {
        const waste = {
          id: index,
          groupId: row.id,
          country: row['country'],
          type: key,
          percent: row[key] * 100,
          deprecatedDate: row['deprecatedDate']
        }
        wastes.push(waste);
      }
    })
    setWasteDetails(wastes);
  }

  const classes = useStyles();

  const closeConfirmDeleteDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_COMPANY_WASTE,
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
    rows: wasteRows,
    columnSettings: [
      { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.country.name },
      { key: 'deprecatedDate', label: 'Deprecated Date', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.deprecatedDate ? moment(row.deprecatedDate).format('YYYY-MM-DD HH:mm') : ''},
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.lastModifiedAt ? moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') : ''},
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
    const wastes = [];
    Object.keys(row).forEach(key => {
      if (key.includes("Percent") && row[key] != 0) {
        const waste = {
          country: row['country'],
          type: key,
          percent: row[key],
          deprecatedDate: row['deprecatedDate'] || ''
        }
        wastes.push(waste);
      }
    })
    const expandedTableData = {
      rows: wastes,
      columnSettings: [
        { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
          bodyCellProps: {
            useEllipsis: true,
          },
          renderElement: row => {return row.country.name;}
        },
        { key: 'type', label: 'Waste Type', sortable: true, disablePadding: false, align: 'left',
          renderElement: row => companyWasteTypesMap[row.type]
        },
        { key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.percent * 100 },
        { key: 'deprecatedDate', label: 'Deprecated Date', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.deprecatedDate ? moment(row.deprecatedDate).format('YYYY-MM-DD HH:mm') : ''}
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
  },[]);

  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{ minHeight: '100%' }} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          <TableTabs value={6}/>
          <FlexDiv row fullWidth fullHeight>
            <FlexDiv item fullHeight style={{ flex: 3 }}>
              <Table
                  toolbarConfig={{
                    title: 'Waste Processing',
                    onAdd: onAdd,
                  }}
                  data={expandedTableData}
                  expand={{
                    position: 'left',
                    renderExpand: renderTableExpand,
                  }}
              />
            </FlexDiv>
            <WasteTableDialog open={wasteDialogOpen} onClose={closeConfirmDialog} wastes={wasteDetails}></WasteTableDialog>
          </FlexDiv>
        </Paper>
        <Dialog open={confirmDialogOpen} onClose={closeConfirmDeleteDialog}>
          <ConfirmContent
            title={"Are you sure to delete selected utility ?"}
            description={'Once deleted, all data of the Asset will be gone forever.'}
            onCancel={closeConfirmDeleteDialog}
            onConfirm={onClickRemove}
            confirmLabel={"Remove"}
          />
        </Dialog>
      </FlexDiv>
    </FlexDiv>
  )
}

export default WasteTab;
