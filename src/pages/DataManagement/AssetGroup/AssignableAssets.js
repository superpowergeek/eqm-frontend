import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import {goBack} from 'connected-react-router';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';

import types from '@constants/actions';
import {
  assignableTypes,
  wasteTypeLabelMap,
  utilityLabelMap,
  assignableTypesLabelMap,
} from '@constants';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import AutoComplete from 'components/shared/AsyncAutoComplete';
import {numberWithCommas, updateStateComposer} from 'utils/functions';
import {usePrevious} from 'utils/hooks';
import * as Selectors from 'selectors';
import AssignTable from '../AssignTable';
import ToggleButton from "@material-ui/lab/ToggleButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import PrevDefaultButton from 'components/shared/PrevDefaultButton';

const initAssignableAsset = {
  amount: '',
  inputType: 0,
  isEdit: true,
  assetEngineId: 0,
  refrigeratorId: 0,
  refrigerant: {id: '', name: ''},
  toggle: 'add'
};

const AssignableAssets = React.memo((props) => {
  const {assetGroupId, assetId, assetType} = props;
  const dispatch = useDispatch();
  const assetDetail = useSelector(Selectors.selectAssetTypeWithParams(assetId, assetType));
  const assetAssignRecordsById = useSelector(Selectors.selectAssigns)[assetType] || {};
  const enginesByAssetId = useSelector(Selectors.selectAssetEngines) || {};
  const assetEngineObject = enginesByAssetId[assetId] || {};
  const refrigeratorByAssetId = useSelector(Selectors.selectAssetRefrigerators) || {};
  const assetRefrigeratorObject = refrigeratorByAssetId[assetId] || {};

  const assetEngineIds = assetEngineObject.ids || [];
  const assetEngineIdMap = assetEngineObject.idMap || {};
  const assetRefrigeratorIds = assetRefrigeratorObject.ids || [];
  const assetRefrigeratorIdMap = assetRefrigeratorObject.idMap || {};
  const prevAssetDetailsIds = usePrevious(assetDetail.ids);
  const [currAssetDetails, setCurrAssetDetails] = React.useState([]);
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [editAmounts, setEditAmounts] = React.useState({});
  const [editTypes, setEditTypes] = React.useState({});
  const [editEngines, setEditEngines] = React.useState({});
  const [editRefrigerators, setEditRefrigerators] = React.useState({});
  const [editRefrigerants, setEditRefrigerants] = React.useState([]);
  const [editToggleValue, setEditToggleValue] = React.useState({});

  const handleToggleChange = React.useCallback((id) => (event, newContent) => {
    if (!newContent) return;
    setEditToggleValue(updateStateComposer(id, newContent));
  }, []);


  React.useEffect(() => {
    if (assetEngineObject.ids) return;
    dispatch({type: types.GET_ASSET_ENGINES, data: {assetId}});
  }, [assetEngineObject.ids, assetId, dispatch]);

  React.useEffect(() => {
    if (assetRefrigeratorObject.ids) return;
    dispatch({type: types.GET_ASSET_REFRIGERATORS, data: {assetId}});
  }, [assetRefrigeratorObject.ids, assetId, dispatch]);


  React.useEffect(() => {
    if (assetDetail.ids && prevAssetDetailsIds !== assetDetail.ids) {
      setCurrAssetDetails(assetDetail.ids.map(id => assetDetail.idMap[id]));
    }
  }, [prevAssetDetailsIds, assetDetail.ids, assetDetail.idMap]);

  React.useEffect(() => {
    if (assetDetail.ids) return;
    dispatch({type: types.GET_ASSET_ALL_PRODUCTS, data: {assetId}});
  }, [assetDetail.ids, assetId, dispatch]);

  const onAdd = () => {
    const tmpObject = {
      ...initAssignableAsset,
      id: `tmp-${uuidv4()}`,
    }
    setEditAmounts(updateStateComposer(tmpObject.id, tmpObject.amount));
    setEditTypes(updateStateComposer(tmpObject.id, tmpObject.inputType));
    setEditEngines(updateStateComposer(tmpObject.id, tmpObject.assetEngineId));
    setEditRefrigerators(updateStateComposer(tmpObject.id, tmpObject.refrigeratorId));
    setEditRefrigerants(updateStateComposer(tmpObject.id, tmpObject.refrigerant));
    setEditToggleValue(updateStateComposer(tmpObject.id, tmpObject.toggle));
    setCurrAssetDetails(prev => [tmpObject,...prev]);
  };

  const onRefrigerantChange = (setter, rowId, id, name) => {
    setter(updateStateComposer(rowId, {id, name}));
  };

  const handleCheck = (rowId) => () => {
    const toggleValue = editToggleValue[rowId];
    const amount = toggleValue === 'add' ? editAmounts[rowId] : -1 * editAmounts[rowId];
    const inputType = editTypes[rowId];
    const assetEngineId = editEngines[rowId];
    const assetRefrigeratorId = editRefrigerators[rowId];
    const refrigerantId = editRefrigerants[rowId].id;
    dispatch({
      type: types.ADD_ASSIGNABLEASSET,
      data: {
        assetGroupId,
        assetId,
        assetType,
        amount,
        inputType,
        assetEngineId,
        assetRefrigeratorId,
        refrigerantId
      }

    })
  };

  const handleCancel = (rowId) => () => {
    setCurrAssetDetails(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  };

  const handleDelete = (rowId) => (e) => {
    e.stopPropagation();
    dispatch({
      type: types.DELETE_ASSIGNABLEASSET,
      data: {
        recordId: rowId,
        assetType,
        assetId,
      }
    })
  };

  const onChange = (setter, id) => e => {
    e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const handleChangeEngine = (id) => (e) => {
    const {value} = e.target;
    const {preferredFuelType} = assetEngineIdMap[value];

    setEditTypes(updateStateComposer(id, preferredFuelType.id));
    setEditEngines(updateStateComposer(id, value));
  }

  const handleChangeRefrigerator = (id) => (e) => {
    const {value} = e.target;
    setEditRefrigerators(updateStateComposer(id, value));
  }

  const columnSettingsMap = {
    [assignableTypes.FUEL_CONSUMPTION]: [
      {
        key: 'amount', label: 'Amount', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${numberWithCommas(row.amount)}(L)`;
          return (
            <TextField
              type="text"
              value={editAmounts[row.id]}
              onChange={onChange(setEditAmounts, row.id)}
            />
          )
        }
      },
      {
        key: 'assetEngine', label: 'AssetEngine', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.assetEngine.name;
          return (
            <Select value={editEngines[row.id]} onChange={handleChangeEngine(row.id)}>
              {assetEngineIds.map(id => (<MenuItem key={id}
                                                   value={id}>{`${assetEngineIdMap[id].name}, ${assetEngineIdMap[id].engine.name}`}</MenuItem>))}
            </Select>
          )
        }
      },
      {
        key: 'fuelType', label: 'FuelType', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.fuelType.name;
          const {availFuels = []} = assetEngineIdMap[editEngines[row.id]] || {};
          return (
            <Select value={editTypes[row.id]} onChange={onChange(setEditTypes, row.id)}>
              {availFuels.map(fuelObject => <MenuItem key={fuelObject.id}
                                                      value={fuelObject.id}>{fuelObject.name}</MenuItem>)}
            </Select>
          )
        }
      },
    ],
    [assignableTypes.WASTE]: [
      {
        key: 'amount', label: 'Amount', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${numberWithCommas(row.amount)}(kg)`;
          return (
            <TextField
              type="text"
              value={editAmounts[row.id]}
              onChange={onChange(setEditAmounts, row.id)}
            />
          )
        }
      },
      {
        key: 'type', label: 'WasteType', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return wasteTypeLabelMap[row.type];
          return (
            <Select
              value={editTypes[row.id]}
              onChange={onChange(setEditTypes, row.id)}>
              {Object.keys(wasteTypeLabelMap).map(key => (
                <MenuItem key={key} value={key}>{wasteTypeLabelMap[key]}</MenuItem>))}
            </Select>
          )
        }
      },
    ],
    [assignableTypes.UTILITY]: [
      {
        key: 'meter', label: 'Meter', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${numberWithCommas(row.meter)}(kWH)`;
          return (
            <TextField
              type="text"
              value={editAmounts[row.id]}
              onChange={onChange(setEditAmounts, row.id)}
            />
          )
        }
      },
      {
        key: 'type', label: 'Type', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return utilityLabelMap[row.type];
          return (
            <Select
              value={editTypes[row.id]}
              onChange={onChange(setEditTypes, row.id)}>
              {Object.keys(utilityLabelMap).map(key => (
                <MenuItem key={key} value={key}>{utilityLabelMap[key]}</MenuItem>))}
            </Select>
          )
        }
      },
    ],
    [assignableTypes.REFRIGERATOR_CONSUMPTION]: [
      {
        key: 'addOrReclaim', label: 'Add/Reclaim', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return (
              <ToggleButtonGroup
                value={row.amount >= 0 ? "add" : "reclaim"}
                exclusive>
                <ToggleButton value="add">
                  <AddIcon/>
                </ToggleButton>
                <ToggleButton value="reclaim">
                  <RemoveIcon/>
                </ToggleButton>
              </ToggleButtonGroup>
            )
          }
          return (
            <ToggleButtonGroup
              value={editToggleValue[row.id]}
              exclusive
              onChange={handleToggleChange(row.id)}>
              <ToggleButton value="add">
                <AddIcon/>
              </ToggleButton>
              <ToggleButton value="reclaim">
                <RemoveIcon/>
              </ToggleButton>
            </ToggleButtonGroup>
          )
        }
      },
      {
        key: 'amount', label: 'Amount', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${Math.abs(numberWithCommas(row.amount))}(m\u00B3)`;
          // if (!row.isEdit) return Math.abs(numberWithCommas(row.amount));
          return (
            <TextField
              type="text"
              value={editAmounts[row.id]}
              onChange={onChange(setEditAmounts, row.id)}
            />
          )
        }
      },
      {
        key: 'assetRefrigerator', label: 'AssetRefrigerator', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.assetRefrigerator.name;
          return (
            <Select value={editRefrigerators[row.id]} onChange={handleChangeRefrigerator(row.id)}>
              {assetRefrigeratorIds.map(id => (
                <MenuItem key={id} value={id}>{`${assetRefrigeratorIdMap[id].name}`}</MenuItem>))}
            </Select>
          )
        }
      },
      {
        key: 'refrigerant', label: 'Refrigerant', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit) return row.refrigerant.name;
          return (
            <AutoComplete
              searchUrl={`/refrigerant?name=${editRefrigerants[row.id].name || ''}`}
              inputValue={editRefrigerants[row.id].name || ''}
              onInputChange={(e) => {
                e.persist();
                setEditRefrigerants(prev => ({
                  ...prev,
                  [row.id]: {
                    ...prev[row.id],
                    name: e.target.value,
                  }
                }));
              }}
              onChange={(e, value) => {
                const {name = '', id = ''} = value || {};
                onRefrigerantChange(setEditRefrigerants, row.id, id, name);
              }}
              getOptionLabel={(option) => {
                return `${option.name}`;
              }}
            />
          )
        }
      },
    ]
  }

  const tableData = React.useCallback({
    rows: currAssetDetails,
    columnSettings: [
      {
        key: 'lastModifiedAt',
        label: 'Update Time',
        sortable: true,
        disablePadding: false,
        align: 'left',
        renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm')
      },
      ...columnSettingsMap[assetType],
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          if (!row.isEdit) {
            return (
              <React.Fragment>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete(row.id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          }
          ;
          return (
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton aira-label="cancel" onClick={handleCancel(row.id)}>
                  <CancelIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Check">
                <IconButton aira-label="check" onClick={handleCheck(row.id)}>
                  <CheckIcon/>
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        }
      },
    ],
  }, [currAssetDetails, columnSettingsMap[assetType]]);

  const onClickRow = React.useCallback((assetId, assetType) => (id) => {
    if (String(id).includes('tmp')) return;
    if(assetType === assignableTypes.REFRIGERATOR_CONSUMPTION) return;
    dispatch({type: types.GET_ASSIGNED_RECORDS, data: {id, type: assetType}});
    setSelectedItemId(id);
  }, [dispatch]);

  const onPrevpage = () => dispatch(goBack());

  return (
    <FlexDiv column>
      <PrevDefaultButton onClick={onPrevpage}/>
      <FlexDiv row fullWidth fullHeight>
        <Table
          toolbarConfig={{
            title: assignableTypesLabelMap[assetType],
            onAdd: onAdd,
          }}
          events={{
            onClickRow: onClickRow(assetId, assetType),
          }}
          data={tableData}
          selectMode="single"
        />
        <AssignTable
          recordsById={assetAssignRecordsById}
          selectedItemId={selectedItemId}
          assignType={assetType}
        />
      </FlexDiv>
    </FlexDiv>
  )
});

export default AssignableAssets;
