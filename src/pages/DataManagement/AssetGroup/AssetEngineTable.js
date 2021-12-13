import React from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import types from '@constants/actions';
import { engineTypesMap } from '@constants';
import * as Selectors from 'selectors';
import Table from 'components/shared/Table';
import { updateStateComposer } from 'utils/functions';
import { usePrevious } from 'utils/hooks';
import { MenuItem } from '@material-ui/core';

const initAssetEngine = {
  name: '',
  engineId: 1,
  fuelTypeId: 1,
  isEdit:true,
  engineType: 1,
}

const AssetEngineTable = (props) => {
  const { assetId } = props;
  const dispatch = useDispatch();
  const engineOptions = useSelector(Selectors.selectEngines) || [];

  const fuelOptions = useSelector(Selectors.selectFuels) || [];
  const assetEnginesByAssetId = useSelector(Selectors.selectAssetEngines) || {};
  const currAssetEngine = assetEnginesByAssetId[assetId] || {};
  const [currAssetEngineRows, setCurrEngineRows] = React.useState([]);
  const [editNames, setEditNames] = React.useState({})
  const [editEngines, setEditEngines] = React.useState({});
  const [editFuelTypeIds, setEditFuelTypeIds] = React.useState({});
  const [editEngineTypes, setEditEngineTypes] = React.useState({});


  const prevAssetEnginesIds = usePrevious(currAssetEngine.ids);

  React.useEffect(() => {
    if (!currAssetEngine.ids) {
      dispatch({ type: types.GET_ASSET_ENGINES, data: { assetId }});
    }
  }, [dispatch, currAssetEngine.ids, assetId]);

  React.useEffect(() => {
    if (engineOptions.length > 0) return;
    dispatch({ type: types.GET_ENGINES });
  }, [dispatch, engineOptions])

  React.useEffect(() => {
    if (fuelOptions.length > 0) return;
    dispatch({ type: types.GET_FUELS });
  }, [dispatch, fuelOptions])

  React.useEffect(() =>{

    if (currAssetEngine.ids && prevAssetEnginesIds !== currAssetEngine.ids){
      setCurrEngineRows(currAssetEngine.ids.map(id => currAssetEngine.idMap[id]));
    }
  }, [prevAssetEnginesIds, currAssetEngine.ids ,currAssetEngine.idMap]);

  const onAdd = () => {
    const tmpObject = {
      ...initAssetEngine,
      id: `tmp-${uuidv4()}`,
    };
    setEditEngineTypes(updateStateComposer(tmpObject.id, tmpObject.engineType));
    setEditNames(updateStateComposer(tmpObject.id, tmpObject.name));
    setEditEngines(updateStateComposer(tmpObject.id, tmpObject.engineId));
    setEditFuelTypeIds(updateStateComposer(tmpObject.id, tmpObject.fuelType));
    setCurrEngineRows(prev => [tmpObject,...prev]);
  };

  const onChange = (setter, id) => e => {
    e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const handleCancel = React.useCallback((rowId) => () => {
    setCurrEngineRows(rows => rows.filter(row =>{
      if(String(rowId).includes('tmp')){
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  }, []);

  const handleDelete = React.useCallback((rowId) => () => {
    dispatch({
      type: types.DELETE_ASSETENGINE,
      data: {
        recordId: rowId,
        assetId,
      }
    })
  }, [dispatch, assetId]);

  const handleCheck = React.useCallback((rowId) => () => {
    const name = editNames[rowId];
    const engineId = editEngines[rowId];
    const fuelTypeId = editFuelTypeIds[rowId];
    dispatch({
      type: types.ADD_ASSETENGINE,
      data: {
        name,
        engineId,
        fuelTypeId,
        assetId,
      },
    })
  }, [editNames, editEngines, editFuelTypeIds, dispatch, assetId])

  const tableData = {
    rows: currAssetEngineRows,
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
        key: 'engineType', label: 'Engine Type', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return engineTypesMap[engineOptions.find((engine) => engine.id === row.engine.id)?.type];
          }
          return (
            <Select value={editEngineTypes[row.id]} onChange={onChange(setEditEngineTypes, row.id)}>
              {Object.entries(engineTypesMap).map(([typeId, name]) => (<MenuItem key={typeId} value={typeId}>{name}</MenuItem>))};
            </Select>
          )
        }
      },
      {
        key: 'engineName', label: 'Engine Name', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.engine.name;
          return (
            <Select value={editEngines[row.id]} onChange={onChange(setEditEngines, row.id)}>
              {(engineOptions.filter((engineObject) => engineObject.type == editEngineTypes[row.id]) || []).map(obj => (<MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>))}
            </Select>
          )
        }
      },
      { 
        key: 'fuel', label: 'Fuel Type', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.preferredFuelType.name;
          return(
            <Select value={editFuelTypeIds[row.id]} onChange={onChange(setEditFuelTypeIds, row.id)}>
              {fuelOptions.map(fuelObject => (<MenuItem key={fuelObject.id} value={fuelObject.id}>{fuelObject.name}</MenuItem>))}
            </Select>
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
        title: 'Asset Engine',
        onAdd: onAdd,
      }}
    />
  )
}

export default AssetEngineTable;
