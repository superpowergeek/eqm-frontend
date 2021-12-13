import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { v4 as uuidv4 } from 'uuid';

import types from '@constants/actions';
import { assignableTypes, vehicleTypesMap } from '@constants';
import * as Selectors from 'selectors';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/StyledConfirmContent';
import { usePrevious } from 'utils/hooks';
import { updateStateComposer } from 'utils/functions';
import AutoComplete from 'components/shared/AsyncAutoComplete';
import AssignTable from '../AssignTable';
import TableTabs from "../TableTabs";

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb(244,247,249)'
  },
  content: {
    padding: 24,
  },
  paperContent: {
    border: 'none',
    boxShadow: 'rgba(193, 203, 208, 0.56) 0 1px 4px 1px ',
    marginLeft: 36,
    marginRight: 36
  }
}));

const initTravelObject = {
  distance: 0,
  description: '',
  start: '',
  end: '',
  vehicletype: '',
  passenger: 0,
  time: moment(),
  isEdit: true,
}

const TravelTab = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const travelByCompanyId = useSelector(Selectors.selectTravels) || {};
  const travels = travelByCompanyId[companyId] || {};
  const assetAssignRecordsById = useSelector(Selectors.selectAssigns)[assignableTypes.TRAVEL] || {};
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const parentsCompany = useSelector(Selectors.selectCurrentParentsCompany);
  const prevTravelIds = usePrevious(travels.ids);

  const [travelRows, setTravelRows] = React.useState([]);
  React.useEffect(() => {
    if (travels.ids && prevTravelIds !== travels.ids) {
      setTravelRows(travels.ids.map(id => travels.idMap[id]));
    }
  }, [prevTravelIds, travels.ids, travels.idMap]);

  React.useEffect(() => {
    if (travels.ids) return;
    dispatch({ type: types.GET_COMPANY_TRAVEL });
  }, [dispatch, travels.ids]);

  const [editStarts, setEditStarts] = React.useState({});
  const [editEnds, setEditEnds] = React.useState({});
  const [editDescs, setEditDescs] = React.useState({});
  const [editDistances, setEditDistances] = React.useState({});
  const [editVehicles, setEditVehicles] = React.useState({});
  const [editPassengers, setEditPassengers] = React.useState({});
  const [editTimes, setEditTimes] = React.useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);

  const onClickRow = React.useCallback((travelId) => {
    if (!parentsCompany || parentsCompany.ids.length === 0) return;
    if (String(travelId).includes('tmp')) return;
    dispatch({ type: types.GET_ASSIGNED_RECORDS, data: { id: travelId, type: assignableTypes.TRAVEL }});
    setSelectedItemId(travelId);
  }, [dispatch, parentsCompany]);

  const onAdd = () => {
    const tmpObject = {
      ...initTravelObject,
      id: `tmp-${uuidv4()}`,
    }
    setEditStarts(updateStateComposer(tmpObject.id, tmpObject.start));
    setEditEnds(updateStateComposer(tmpObject.id, tmpObject.end));
    setEditVehicles(updateStateComposer(tmpObject.id, tmpObject.vehicletype));
    setEditDistances(updateStateComposer(tmpObject.id, tmpObject.distance));
    setEditDescs(updateStateComposer(tmpObject.id, tmpObject.description));
    setEditPassengers(updateStateComposer(tmpObject.id, tmpObject.passenger));
    setEditTimes(updateStateComposer(tmpObject.id, tmpObject.time));

    setTravelRows(prev => [tmpObject, ...prev]);
  }
  const classes = useStyles();

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const onTimeChange = (setter, id) => (date) => {
    setter(updateStateComposer(id, date));
  };

  const handleCheck = (rowId) => () => {
    const start = editStarts[rowId];
    const end = editEnds[rowId];
    const vehicleType = editVehicles[rowId];
    const description = editDescs[rowId];
    const distance = editDistances[rowId];
    const passenger = editPassengers[rowId];
    // TODO: select time by datetimepicker
    const time = editTimes[rowId] && editTimes[rowId].format('x');
    // TODO: select car by autocomplete
    const carId = vehicleType === "1" ? "354" : undefined;
    // should rm rowId from rows
    dispatch({
      type: types.ADD_COMPANY_TRAVEL,
      data: {
        start,
        end,
        vehicleType,
        description,
        distance,
        passenger,
        time,
        carId,
      }
    })
  };

  const handleCancel = (rowId) => () => {
    setTravelRows(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  };

  const closeConfirmDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_COMPANY_TRAVEL,
      data: {
        recordId: selectedId,
      }
    })
  }, [dispatch, selectedId]);

  const handleDelete = (rowId) => () => {
    setSelectedId(rowId);
    setConfirmDialogOpen(true);
  };

  const tableData = {
    rows: travelRows,
    columnSettings: [
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') },
      { key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit) return row.description;
          return (
            <TextField
              type="text"
              value={editDescs[row.id]}
              onChange={onChange(setEditDescs, row.id)}
            />
          )
        }
      },
      { key: 'distance', label: 'Distance', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${row.distance}(km)`;
          return (
            <TextField
              type="number"
              value={editDistances[row.id]}
              onChange={onChange(setEditDistances, row.id)}
            />
          )
        }
      },
      { key: 'passenger', label: 'Passenger', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.passenger || '0';
          return (
            <TextField
              type="number"
              value={editPassengers[row.id]}
              onChange={onChange(setEditPassengers, row.id)}
            />
          )
        }
      },
      { key: 'vehicletype', label: 'Vehicle', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            if (row.vehicletype === "1") {
              return (
                <FlexDiv container row>
                  <FlexDiv item>{vehicleTypesMap[row.vehicletype]}</FlexDiv>
                </FlexDiv>
              )
            }
            return vehicleTypesMap[row.vehicletype];
          }
          return (
            <FlexDiv container row>
              <Select value={editVehicles[row.id]} onChange={onChange(setEditVehicles, row.id)}>
                {Object.entries(vehicleTypesMap).map(([typeId, name]) => (<MenuItem key={typeId} value={typeId}>{name}</MenuItem>))}
              </Select>
            </FlexDiv>
          )
        }
      },
      { key: 'start', label: 'Start', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.start;
          if (editVehicles[row.id] === "4") {
            return (
              <AutoComplete
                searchUrl={`/travel/airport?name=${editStarts[row.id]}`}
                inputValue={editStarts[row.id]}
                onInputChange={onChange(setEditStarts, row.id)}
                onChange={(e, value) => {
                  const { icaoCode = '' } = value || {}
                  setEditStarts(updateStateComposer(row.id, icaoCode));
                }}
                getOptionLabel={(option) => {
                  return `${option.iataCode}, ${option.name}`;
                }}
              />
            )
          }
          return (
            <TextField
              type="text"
              value={editStarts[row.id]}
              onChange={onChange(setEditStarts, row.id)}
            />
          )
        }
      },
      { key: 'end', label: 'End', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.end;
          if (editVehicles[row.id] === "4") {
            return (
              <AutoComplete
                searchUrl={`/travel/airport?name=${editEnds[row.id]}`}
                inputValue={editEnds[row.id]}
                onInputChange={onChange(setEditEnds, row.id)}
                onChange={(e, value) => {
                  const { icaoCode = '' } = value || {}
                  setEditEnds(updateStateComposer(row.id, icaoCode));
                }}
                getOptionLabel={(option) => {
                  return `${option.iataCode}, ${option.name}`;
                }}
              />
            )
          }
          return (
            <TextField
              type="text"
              value={editEnds[row.id]}
              onChange={onChange(setEditEnds, row.id)}
            />
          )
        }
      },
      {
        key: 'time', label: 'Start Time', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return moment(row.time).format('YYYY/MM/DD HH:mm');
          return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <FlexDiv>
                <DateTimePicker
                  value={editTimes[row.id] || null}
                  format={"YYYY/MM/DD HH:mm"}
                  onChange={onTimeChange(setEditTimes, row.id)}
                  autoOk
                />
              </FlexDiv>
            </MuiPickersUtilsProvider>
          )
        }
      },
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          if (!row.isEdit) {
            return (
              <React.Fragment>
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
    ]
  };

  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{ minHeight: '100%' }} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          <TableTabs value={1}/>
          <FlexDiv row fullWidth fullHeight>
            <FlexDiv item fullHeight style={{ flex: 3 }}>
              <Table
                toolbarConfig={{
                  title: 'Company Travel',
                  onAdd: onAdd,
                }}
                events={{
                  onClickRow: onClickRow,
                }}
                data={tableData}
                selectMode="single"
              />
            </FlexDiv>
            <FlexDiv item style={{ flex: 2 }}>
              <AssignTable
                recordsById={assetAssignRecordsById}
                selectedItemId={selectedItemId}
                assignType={assignableTypes.TRAVEL}
              />

            </FlexDiv>
          </FlexDiv>
        </Paper>
        <Dialog open={confirmDialogOpen} onClose={closeConfirmDialog}>
          <ConfirmContent
            title={"Are you sure to delete selected travel ?"}
            description={'Once deleted, all data of the Asset will be gone forever.'}
            onCancel={closeConfirmDialog}
            onConfirm={onClickRemove}
            confirmLabel={"Remove"}
          />
        </Dialog>
      </FlexDiv>
    </FlexDiv>
  )
}

export default TravelTab;
