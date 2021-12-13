import React from 'react';
import moment from 'moment';
import { usePrevious } from 'utils/hooks';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Select, MenuItem, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Table from 'components/shared/Table';
import * as Selectors from 'selectors';
import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/ConfirmContent'; 
import { updateStateComposer } from 'utils/functions';

const initObject = {
  company: '',
  percent: 0,
  lastModifiedAt: new Date(),
  isEdit: true,
};

const AssignTable = (props) => {
  const { recordsById, selectedItemId, assignType } = props;
  const prevAssignRecordsIds = usePrevious(recordsById[selectedItemId] && recordsById[selectedItemId].ids);
  const [assignRows, setAssignRows] = React.useState([]);
  const [editPercents, setEditPercents] = React.useState({});
  const [editCompanies, setEditCompanies] = React.useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedObject, setSelectedObject] = React.useState({});

  const parentsCompany = useSelector(Selectors.selectCurrentParentsCompany) || {};
  
  const parentsIds = parentsCompany.ids || [];
  const parentsIdMap = parentsCompany.idMap || {};

  const dispatch = useDispatch();
  React.useEffect(() => {
    const rowIds = (recordsById[selectedItemId] && recordsById[selectedItemId].ids) || [];
    const rowIdMap = (recordsById[selectedItemId] && recordsById[selectedItemId].idMap) || {};
    const rowsData = rowIds.map(id => rowIdMap[id]);
    if (rowIds !== prevAssignRecordsIds) {
      setAssignRows(rowsData);
    }
  }, [recordsById, selectedItemId, setAssignRows, prevAssignRecordsIds]);

  const onAdd = () => {
    const tmpObject = {
      ...initObject,
      id: `tmp-${uuidv4()}`,
    }

    setEditPercents(updateStateComposer(tmpObject.id, tmpObject.percent));
    setEditCompanies(updateStateComposer(tmpObject.id, tmpObject.company));
    setAssignRows(prev => [...prev, tmpObject]);
  }

  const onChangeCompany = (id) => (e) => {
    setEditCompanies(updateStateComposer(id, e.target.value));
  }
  const onChangePercent = (id) => (e) => {
    e.persist();
    setEditPercents(updateStateComposer(id, e.target.value));
  }

  const handleEdit = (rowId) => () => {
    let editingRow = {};
    setAssignRows(prevAssignRows => prevAssignRows.map(row => {
      if (row.id === rowId) {
        editingRow = row;
        return {
          ...row,
          isEdit: true,
        }
      }
      return row;
    }));
    setEditPercents(prevPercents => {
      return {
        ...prevPercents,
        [rowId]: editingRow.percent * 100,
      }
    })
    setEditCompanies(preCompanies => {
      return {
        ...preCompanies,
        [rowId]: (editingRow.companyId) || '',
      }
    })
  }

  const closeConfirmDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_ASSIGN_RECORD,
      data: selectedObject
    })
  }, [dispatch, selectedObject]);

  const handleDelete = (rowId) => () => {
    setSelectedObject({
      recordId: rowId,
      type: assignType,
      itemId: selectedItemId,
    });
    setConfirmDialogOpen(true);
  }

  const handleCancel = (rowId) => () => {
    setAssignRows(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  }

  const handleCheck = (rowId) => () => {
    const percent = editPercents[rowId] / 100;
    const company = editCompanies[rowId];
    if (String(rowId).includes('tmp')) {
      return dispatch({ type: types.ADD_ASSIGN_RECORD, data: {
        percent,
        parentId: company,
        type: assignType,
        itemId: selectedItemId,
      }});
    }
    // Update Assigned Record
    dispatch({
      type: types.UPDATE_ASSIGN_RECORD,
      data: {
        percent,
        type: assignType,
        itemId: selectedItemId,
        recordId: rowId,
      }
    })
  }

  const assginTableData = {
    rows: assignRows || [],
    columnSettings: [
      { key: 'assignedCompany', label: 'Assigned Company', sortable: false, disablePadding: false, align: 'left', renderElement: row => {
          if (!row.isEdit) {
            return (parentsIdMap[row.companyId] && parentsIdMap[row.companyId].name) || '';
          }
          return (
            <Select value={editCompanies[row.id]} onChange={onChangeCompany(row.id)}>
              {parentsIds.map(id => <MenuItem key={id} value={id}>{parentsIdMap[id].name}</MenuItem>)}
            </Select>
          )
      } },
      { key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'right', renderElement: row => {
          if (!row.isEdit) return `${row.percent * 100} %`;
          return (
            <TextField
              type="number"
              value={editPercents[row.id]}
              onChange={onChangePercent(row.id)}
            />
          )
        }
      },
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') },
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          if (!row.isEdit) {
            return (
              <React.Fragment>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          };
          return (
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton aria-label="cancel" onClick={handleCancel(row.id)}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Check">
                <IconButton aria-label="check" onClick={handleCheck(row.id)}>
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ],
  }

  if (parentsIds.length === 0) {
    return (
      <FlexDiv container crossAlign="center" mainAlign="center" fullWidth>
        <Typography>No client available</Typography>
      </FlexDiv>
    )
  }

  if (!selectedItemId) {
    return (
      <FlexDiv container crossAlign="center" mainAlign="center" fullWidth>
        <Typography>Please select an item on left side</Typography>
      </FlexDiv>
    )
  }

  return (
    <React.Fragment>
      <Table
        toolbarConfig={{
          title: 'Assign',
          onAdd: onAdd,
        }}
        data={assginTableData}
      />
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
        <ConfirmContent
          title={"Are you sure to delete selected assigned record ?"}

          onCancel={closeConfirmDialog}
          onConfirm={onClickRemove}
          confirmLabel={"Remove"}
        />
      </Dialog>
    </React.Fragment>
  )
}

export default AssignTable;