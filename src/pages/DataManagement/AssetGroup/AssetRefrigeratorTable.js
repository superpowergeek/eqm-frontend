import React from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import Table from 'components/shared/Table';
import {updateStateComposer} from 'utils/functions';
import {usePrevious} from 'utils/hooks';

const initAssetRefrigerator = {
  name: '',
  assetId: 1,
  capacity: 0,
  isEdit:true,
}

const AssetRefrigeratorTable = (props) => {
  const { assetId } = props;
  const dispatch = useDispatch();

  const assetRefrigeratorByAssetId = useSelector(Selectors.selectAssetRefrigerators) || {};
  const currAssetRefrigerator = assetRefrigeratorByAssetId[assetId] || {};
  const [currAssetRefrigeratorRows, setCurrAssetRefrigeratorRows] = React.useState([]);
  const [editNames, setEditNames] = React.useState({})
  const [editCapacity, setEditCapacity] = React.useState({});

  const prevAssetRefrigeratorIds = usePrevious(currAssetRefrigerator.ids);

  React.useEffect(() => {
    if (!currAssetRefrigerator.ids) {
      dispatch({ type: types.GET_ASSET_REFRIGERATORS, data: { assetId }});
    }
  }, [dispatch, currAssetRefrigerator.ids, assetId]);

  React.useEffect(() => {
    if (currAssetRefrigerator.ids && prevAssetRefrigeratorIds !== currAssetRefrigerator.ids) {
      setCurrAssetRefrigeratorRows(currAssetRefrigerator.ids.map(id => currAssetRefrigerator.idMap[id]));
    }
  }, [prevAssetRefrigeratorIds, currAssetRefrigerator.ids, currAssetRefrigerator.idMap]);

  const onAdd = () => {
    const tmpObject = {
      ...initAssetRefrigerator,
      id: `tmp-${uuidv4()}`,
    };
    setEditNames(updateStateComposer(tmpObject.id, tmpObject.name));
    setEditCapacity(updateStateComposer(tmpObject.id, tmpObject.capacity));
    setCurrAssetRefrigeratorRows(prev => [tmpObject,...prev]);
  };

  const onChange = (setter, id) => e => {
    e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const handleCancel = React.useCallback((rowId) => () => {
    setCurrAssetRefrigeratorRows(rows => rows.filter(row =>{
      if(String(rowId).includes('tmp')){
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  }, []);

  const handleDelete = React.useCallback((rowId) => () => {
    dispatch({
      type: types.DELETE_REFRIGERATOR,
      data: {
        recordId: rowId,
        assetId,
      }
    })
  }, [dispatch, assetId]);

  const handleCheck = React.useCallback((rowId) => () => {
    const name = editNames[rowId];
    const capacity = editCapacity[rowId];
    dispatch({
      type: types.ADD_REFRIGERATOR,
      data: {
        name,
        capacity,
        assetId,
      },
    })
  }, [editNames, dispatch, editCapacity, assetId])

  const tableData = {
    rows: currAssetRefrigeratorRows,
    columnSettings: [
      {
        key: 'name', label: 'Name', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.name;
          return (
            <TextField
              type="text"
              value={editNames[row.id]}
              onChange={onChange(setEditNames, row.id)}
            />
          )
        }
      },
      {
        key: 'capacity', label: 'Capacity', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return `${row.capacity}(m\u00B3)`;
          }
          return (
            <TextField
              type="number"
              value={editCapacity[row.id]}
              onChange={onChange(setEditCapacity, row.id)}
            />
          )
        }
      },
      { key: 'lastModifiedAt', label: 'Last Update', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm')},
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          if(!row.isEdit) {
            return null;
          };
          return(
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton aira-label="cancel" onClick={handleCancel(row.id)}>
                  <CancelIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Check">
                <IconButton aira-label="check" onClick={handleCheck(row.id)}>
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ]
  };
  return (
    <Table
      data={tableData}
      toolbarConfig={{
        title: 'Asset Refrigerator',
        onAdd: onAdd,
      }}
    />
  )
}

export default AssetRefrigeratorTable;
