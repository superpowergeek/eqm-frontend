import React from 'react';
import moment from 'moment';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { v4 as uuidv4 } from 'uuid';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import Table from 'components/shared/Table';
import ConfirmContent from 'components/shared/ConfirmContent';
import AutoComplete from 'components/shared/AsyncAutoComplete';
import types from '@constants/actions';
import { assignableTypes } from '@constants';
import { updateStateComposer, numberWithCommas } from 'utils/functions';
import * as Selectors from 'selectors';
import { usePrevious } from 'utils/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { MenuItem } from '@material-ui/core';

const itemIdGetter = {
  [assignableTypes.FUEL_CONSUMPTION]: row => row.consumption.id,
  [assignableTypes.WASTE]: row => row.waste.id,
  [assignableTypes.UTILITY]: row => row.utility.id,
  [assignableTypes.TRAVEL]: row => row.travel.id,
}
const defaultObject = {
  assetId: '',
  assetGroupId: '',
  companyId: '',
  itemId: '',
  name: '',
  type: '',
  amount: 0,
  percent: 10,
  description: '',
  country: 'default',
  isEdit: true,
};

const initObjectMap = {
  [assignableTypes.FUEL_CONSUMPTION]: defaultObject,
  [assignableTypes.WASTE]: defaultObject,
  [assignableTypes.UTILITY]: defaultObject,
  [assignableTypes.TRAVEL]: {
    companyId: '',
    name: '',
    description: '',
    country: 'default',
    isEdit: true,
  },
}

const AssignRecordTable = (props) => {
  const { rows, type, targetCompany } = props;
  const dispatch = useDispatch();
  const currCompanyId = useSelector(Selectors.selectUserCompanyId);
  const assetGroupObject = useSelector(Selectors.selectAssetGroups)[currCompanyId] || {};
  const assetGroupIds = assetGroupObject.ids || [];
  const assetGroupIdMap = assetGroupObject.idMap || {};

  const assetsByGroupId = useSelector(Selectors.selectAssets);

  const prevCurrRows = usePrevious(rows);
  const prevType = usePrevious(type);

  const [currType, setCurrType] = React.useState(type);
  const [currRows, setCurrRows] = React.useState(rows);
  React.useEffect(() => {
    if (type !== prevType) setCurrType(type);
  }, [type, prevType])

  React.useEffect(() => {
    if (rows && rows !== prevCurrRows) setCurrRows(rows);
  }, [prevCurrRows, rows]);

  const [editItemIds, setEditItemIds] = React.useState({});
  const [editGroupIds, setEditGroupIds] = React.useState({});
  const [editAssetIds, setEditAssetIds] = React.useState({});
  const [editPercents, setEditPercents] = React.useState({});
  const [editAmounts, setEditAmounts] = React.useState({}); // amount, distance, meter
  const [editDescs, setEditDescs] = React.useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedObject, setSelectedObject] = React.useState({});

  const onAdd = (type) => () => {
    const initObject = {
      ...initObjectMap[type],
      id: `tmp-${uuidv4()}`,
    };

    setEditItemIds(updateStateComposer(initObject.id, initObject.itemId));
    setEditGroupIds(updateStateComposer(initObject.id, initObject.assetGroupId));
    setEditAssetIds(updateStateComposer(initObject.id, initObject.assetId));
    setEditPercents(updateStateComposer(initObject.id, initObject.percent));
    setEditAmounts(updateStateComposer(initObject.id, initObject.amount));
    setCurrRows(prev => [initObject,...prev]);
  }

  const handleCheckSuccess = React.useCallback((rowId) => (response) => {
    const { record } = response;
    setCurrRows(rows => rows.map(row => {
      if (row.id === rowId) return record;
      return row;
    }));
    // TODO: reaction of add success
  }, []);

  const handleCheckError = React.useCallback((rowId) => (error) => {
    setCurrRows(rows => rows.filter(row => row.id !== rowId));
    // TODO: reaction of add error
  }, []);

  const handleCheck = (rowId) => () => {
    const itemId = editItemIds[rowId];
    const percent = editPercents[rowId] / 100;
    dispatch({
      type: types.ADD_ASSIGN_RECORD,
      [WAIT_FOR_ACTION]: types.ADD_ASSIGN_RECORD_SUCCESS,
      [ERROR_ACTION]: types.ADD_ASSIGN_RECORD_ERROR,
      data: {
        percent,
        parentId: targetCompany,
        type: currType,
        itemId,
      }
    }).then(handleCheckSuccess(rowId))
    .catch(handleCheckError(rowId));
  }

  const handleDeleteSuccess = React.useCallback(rowId => (res) => {
    setCurrRows(rows => rows.filter(row => row.id !== rowId));
    // TODO: reaction of delete success
  }, []);

  const handleDeleteError = React.useCallback((rowId) => (error) => {
    console.log(`${rowId} delete error`);
    // TODO: reaction of delete error
  }, []);

  const closeConfirmDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_ASSIGN_RECORD,
      [WAIT_FOR_ACTION]: types.DELETE_ASSIGN_RECORD_SUCCESS,
      [ERROR_ACTION]: types.DELETE_ASSIGN_RECORD_ERROR,
      data: selectedObject,
    }).then(handleDeleteSuccess(selectedObject.recordId))
      .catch(handleDeleteError(selectedObject.recordId));
  }, [dispatch, handleDeleteSuccess, handleDeleteError, selectedObject]);

  const handleDelete = (rowId, itemId) => () => {
    setSelectedObject({
      recordId: rowId,
      parentId: targetCompany,
      type: currType,
      itemId,
    });
    setConfirmDialogOpen(true);
  }

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
  }

  const typeColumsMap = {
    [assignableTypes.WASTE]: [
      { key: 'assetGroup', label: 'AssetGroup', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.waste.asset.fleet && row.waste.asset.fleet.name;
          return (
            <Select value={editGroupIds[row.id]} onChange={onChange(setEditGroupIds, row.id)}>
              {/* {assetGroupCollection.map(object => (<MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>))} */}
              {assetGroupIds.map(id => (<MenuItem key={id} value={id}>{assetGroupIdMap[id].name}</MenuItem>))}
            </Select>
          )
        },
      },
      {
        key: 'asset', label: 'Asset', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.waste.asset.name;
          const assetObject = assetsByGroupId[editGroupIds[row.id]] || {};
          const assetCollection = assetObject.collection || [];
          return (
            <Select value={editAssetIds[row.id]} onChange={onChange(setEditAssetIds, row.id)}>
              {assetCollection.map(object => (<MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>))}
            </Select>
          )
        },
      },
      {
        key: 'assetUpdate', label: 'Waste Update Time', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return moment(row.waste.lastModifiedAt).format('YYYY-MM-DD');
          const assetId = editAssetIds[row.id];
          return (
            <AutoComplete
              searchUrl={`/waste/search?search=asset.id:${assetId}`}
              onChange={(e, value) => {
                const { id = '', amount = '' } = value || {};
                setEditItemIds(updateStateComposer(row.id, id));
                setEditAmounts(updateStateComposer(row.id, amount));
              }}
              getOptionLabel={(option) => {
                return `[${option.id}]:${moment(option.lastModifiedAt).format('YYYY-MM-DD')}`;
              }}
            />
          );
        },
      },
      {
        key: 'amount', label: 'Amount', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return numberWithCommas(row.waste.amount);
          return editAmounts[row.id];
        }
      },
    ],
    [assignableTypes.UTILITY]: [
      {
        key: 'assetGroup', label: 'AssetGroup', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.utility.asset.fleet && row.utility.asset.fleet.name;
          return (
            <Select value={editGroupIds[row.id]} onChange={onChange(setEditGroupIds, row.id)}>
              {assetGroupIds.map(id => (<MenuItem key={id} value={id}>{assetGroupIdMap[id].name}</MenuItem>))}
            </Select>
          )
        },
      },
      {
        key: 'asset', label: 'Asset', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.utility.asset.name;
          const assetObject = assetsByGroupId[editGroupIds[row.id]] || {};
          const assetCollection = assetObject.collection || [];
          return (
            <Select value={editAssetIds[row.id]} onChange={onChange(setEditAssetIds, row.id)}>
              {assetCollection.map(object => (<MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>))}
            </Select>
          )
        },
      },
      {
        key: 'assetUpdate', label: 'Utility Update Time', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return moment(row.utility.lastModifiedAt).format('YYYY-MM-DD');
          const assetId = editAssetIds[row.id];
          return (
            <AutoComplete
              searchUrl={`/assetutility/search?search=asset.id:${assetId}`}
              onChange={(e, value) => {
                const { id = '', meter = '' } = value || {};
                setEditItemIds(updateStateComposer(row.id, id));
                setEditAmounts(updateStateComposer(row.id, meter));
              }}
              getOptionLabel={(option) => {
                return `[${option.id}]:${moment(option.lastModifiedAt).format('YYYY-MM-DD')}`;
              }}
            />
          );
        },
      },
      {
        key: 'meter', label: 'Meter', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return numberWithCommas(row.utility.meter);
          return editAmounts[row.id];
        }
      },
    ],
    [assignableTypes.FUEL_CONSUMPTION]: [
      {
        key: 'assetGroup', label: 'AssetGroup', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.consumption.assetEngine.asset.fleet && row.consumption.assetEngine.asset.fleet.name;
          return (
            <Select value={editGroupIds[row.id]} onChange={onChange(setEditGroupIds, row.id)}>
              {/* {assetGroupCollection.map(object => (<MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>))} */}
              {assetGroupIds.map(id => (<MenuItem key={id} value={id}>{assetGroupIdMap[id].name}</MenuItem>))}
            </Select>
          )
        }
      },
      {
        key: 'asset', label: 'Asset', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.consumption.assetEngine.asset.name;
          const assetObject = assetsByGroupId[editGroupIds[row.id]] || {};
          const assetCollection = assetObject.collection || [];
          return (
            <Select value={editAssetIds[row.id]} onChange={onChange(setEditAssetIds, row.id)}>
              {assetCollection.map(object => (<MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>))}
            </Select>
          )
        }
      },
      {
        key: 'assetUpdate', label: 'Fuel Consumption Update Time', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return moment(row.consumption.lastModifiedAt).format('YYYY-MM-DD');
          const assetId = editAssetIds[row.id];
          return (
            <AutoComplete
              searchUrl={`/assetfuelconsumption/search?search=assetEngine.asset.id:${assetId}`}
              onChange={(e, value) => {
                const { id = '', amount = '' } = value || {};
                setEditItemIds(updateStateComposer(row.id, id));
                setEditAmounts(updateStateComposer(row.id, amount));
              }}
              getOptionLabel={(option) => {
                return `[${option.id}]:${moment(option.lastModifiedAt).format('YYYY-MM-DD')}`;
              }}
            />
          );
        },
      },
      {
        key: 'amount', label: 'Amount', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.consumption.amount;
          return editAmounts[row.id];
        },
      },
    ],
    [assignableTypes.TRAVEL]: [
      { key: 'travelUpdate', label: 'Travel Update Time', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return moment(row.travel.lastModifiedAt).format('YYYY-MM-DD');
          return (
            <AutoComplete
              searchUrl={'/travel'}
              onChange={(e, value) => {
                const { id = '', distance = '', description = '' } = value || {};
                console.log(value);
                setEditItemIds(updateStateComposer(row.id, id));
                setEditAmounts(updateStateComposer(row.id, distance));
                setEditDescs(updateStateComposer(row.id, description));
              }}
              getOptionLabel={(option) => {
                return `[${option.id}]:${moment(option.lastModifiedAt).format('YYYY-MM-DD')}`;
              }}
            />
          );
        },
      },
      { key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.travel.description;
          return editDescs[row.id];
        },
      },
      { key: 'distance', label: 'Distance', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.travel.distance;
          return editAmounts[row.id];
        },
      },
    ],
  }

  const handleCancel = (rowId) => () => {
    setCurrRows(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  }

  const tableData = {
    rows: currRows,
    columnSettings: [
      ...(typeColumsMap[currType] || []),
      { key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${row.percent * 100} %`;
          return (
            <TextField
              type="number"
              value={editPercents[row.id]}
              onChange={onChange(setEditPercents, row.id)}
            />
          )
        }
      },
      { key: 'lastModifiedAt', label: 'Last Update', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY/MM/DD HH:mm') },
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          if (!row.isEdit) {
            return (
              <React.Fragment>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete(row.id, itemIdGetter[currType](row))}>
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
    ]
  };

  if (!type) return null;

  return (
    <React.Fragment>
      <Table
        data={tableData}
        toolbarConfig={{
          title: `Assigned ${currType}`,
          onAdd: onAdd(type),
        }}
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

export default AssignRecordTable;
