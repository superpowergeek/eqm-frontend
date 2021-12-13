import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import {v4 as uuidv4} from 'uuid';

import {companyWasteTypesMap} from '@constants';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import {updateStateComposer} from 'utils/functions';
import AutoComplete from 'components/shared/AsyncAutoComplete';
import Dialog from '@material-ui/core/Dialog';
import {makeStyles} from "@material-ui/core";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
  },
  paper: {
    maxWidth: '100%',
    width: '80%',
  },
  btn: {
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#ef5423',
    '&:hover': {
      backgroundColor: '#ef5423',
    },
  }
}));

const initWasteObject = {
  country: { id: '', name: '' },
  wasteType: '', 
  percent: 0,
  isEdit: true,
}

const WasteTableDialog = (props) => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);

  const [wasteDatas, setWasteDatas] = React.useState([]);
  const [wasteRows, setWasteRows] = React.useState([]);
  const [editCountries, setEditCountries] = React.useState({id: '', name: ''});
  const [editWasteTypes, setEditWasteTypes] = React.useState({}); 
  const [editPercents, setEditPercents] = React.useState({});
  const [editDeprecatedDate, setEditDeprecatedDate] = React.useState('');
  const [isEdit, setIsEdit] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    if (!props.wastes) return;
    if (props.open) {
      setIsEdit(props.wastes.length ? true : false);
      setWasteRows(props.wastes.map(c => { 
        setEditCountries(c.country);
        setEditWasteTypes(updateStateComposer(c.id, c.type)); 
        setEditPercents(updateStateComposer(c.id, c.percent));
        setEditDeprecatedDate(c.deprecatedDate);
        return {
          ...c,
          country: {name: c.country.name, id: c.country.id},
          isEdit: true
        };
      })); 
    }
  }, [props.open, props.wastes]);

  const onAdd = () => {
    console.log({wasteRows});
    const tmpObject = {
      ...initWasteObject,
      id: `tmp-${uuidv4()}`,
    }
    setEditWasteTypes(updateStateComposer(tmpObject.id, tmpObject.wasteType)); 
    setEditPercents(updateStateComposer(tmpObject.id, tmpObject.percent));
    if (props.wastes.length > 0) {
      setEditDeprecatedDate(editDeprecatedDate); 
    } 
    setWasteRows(prev => [tmpObject, ...prev]);
  };

  const submit = () => {
    let action;
    let records = {};
    Object.keys(companyWasteTypesMap).forEach(key => {
      records[`${key}`] = 0;
    })
    wasteDatas.forEach(data => {
      records[`${data.type}`] = (records[`${data.type}`] + data.percent) / 100;
    })
    if (props.wastes.length > 0) { // Edit wastes
      records['deprecatedDate'] = wasteDatas[0]?.deprecatedDate; 
      action = {
        type: types.UPDATE_COMPANY_WASTE,
        data: {
          records,
          recordId: props.wastes[0].groupId
        },
      };
    } else {
      records['companyId'] = companyId;
      records['countryId'] = wasteDatas[0]?.countryId;
      action = {
        type: types.ADD_COMPANY_WASTE,
        data: records
      };
    }  
    if (wasteDatas.length > 0 && wasteDatas.filter(data => !data.isEdit).map(data => parseInt(data.percent)).reduce((a, b) => a + b) === 100) {
      dispatch(action);
      setWasteRows(wasteRows.filter(data => data.isEdit));
      setWasteDatas([]);
      props.onClose();
    } else {
      setWasteDatas([]);
    }
  };

  const cancel = () => {
    setWasteRows([]);
    props.onClose();
  };

  const handleCheck = (rowId) => () => { 
    const country = editCountries;
    const wasteType = editWasteTypes[rowId]; 
    const percent = editPercents[rowId];
    const deprecatedDate = editDeprecatedDate;
    const data = {
      countryId: country.id,
      companyId,
      type: wasteType, 
      percent,
      deprecatedDate
    }

    setWasteDatas(prev => [...prev, data]);
    if (props.wastes.length > 0) { // Edit wastes
      setWasteRows(rows => rows.filter(row => {
        row.country = country;
        row.deprecatedDate = deprecatedDate;
        if (row.id === rowId) {
          row.type = wasteType; 
          row.percent = percent;
          row.isEdit = false;
        }
        return true;
      }));
    } else {
      // Add new wastes
      setWasteRows(rows => rows.filter(row => {
        row.country = country;
        if (String(rowId).includes('tmp') && row.id === rowId) {
          row.type = wasteType; 
          row.percent = percent;
          row.isEdit = false;
        }
        return true;
      }));
    }
  };

  const handleCancel = (rowId) => () => {
    if (props.wastes.length > 0) { // Edit wastes
      setWasteRows(rows => rows.filter(row => {
        return row.id !== rowId;
      }));
    } else {
      setWasteRows(rows => rows.filter(row => {
        if (String(rowId).includes('tmp')) {
          return row.id !== rowId;
        }
        row.isEdit = false;
        return true;
      }));
    }
  };

  const onPercentChange = (setter, id) => (e) => {
    if (e.persist) e.persist(); 
    const { value } = e.target;
    if (value.match('.')) { 
      setter(updateStateComposer(id, parseInt(value))); 
    } 
    if ( value > 100 ) {
      setter(updateStateComposer(id, 100)); 
    }

    if (value < 0) {
      setter(updateStateComposer(id, 0));
    }
    return null; 
  };

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist(); 
    setter(updateStateComposer(id, e.target.value));
  };
 
  const tableData = {
    rows: wasteRows,
    columnSettings: [
      {
        key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit || props.wastes.length > 0) return editCountries.name;
          return (
            <AutoComplete
              searchUrl={`/country?name=${editCountries.name}`}
              inputValue={editCountries.name}
              onInputChange={(e) => {
                e.persist();
                setEditCountries(prev => ({...prev, name: e.target.value}));
              }}
              onChange={(e, value) => {
                const {name = '', id = ''} = value || {};
                setEditCountries({
                  name,
                  id,
                });
              }}
              getOptionLabel={(option) => {
                return `${option.name}`;
              }}
            />
          )
        }
      },
      {
        key: 'type', label: 'Waste Type', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return companyWasteTypesMap[row.type];
          }
          return (
            <FlexDiv container row>
              <Select value={editWasteTypes[row.id]} onChange={onChange(setEditWasteTypes, row.id)}>
                {Object.entries(companyWasteTypesMap).map(([type, name]) => (
                  <MenuItem key={type} value={type}>{name}</MenuItem>))}
              </Select>
            </FlexDiv>
          )
        }
      },
      {
        key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.percent
          return (
            <TextField
              type="number" 
              value={editPercents[row.id]}
              onChange={onPercentChange(setEditPercents, row.id)}
            />
          )
        }
      },
      {
        key: 'deprecatedDate', label: 'Deprecated Date', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          return editDeprecatedDate ? moment(editDeprecatedDate).format('YYYY-MM-DD HH:mm') : '';
        }
      },
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          if (!row.isEdit) return null;
          return (
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton aria-label="cancel" onClick={handleCancel(row.id)}>
                  <CancelIcon/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Check">
                <IconButton aria-label="check" onClick={handleCheck(row.id)}>
                  <CheckIcon/>
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ]
  };

  return (
    <Dialog open={props.open} onClose={props.onClose} className={classes.root} classes={{ paperWidthSm: classes.paper }}>
      <FlexDiv column>
        <Table
          toolbarConfig={{
            title: isEdit ? 'Edit Waste List' : 'Add Waste List',
            onAdd: onAdd,
          }}
          data={props.wastes.length > 0 ? tableData : tableData}
          selectMode="single"
          className={classes.table}
        />
        <FlexDiv item row fullWidth mainAlign="center" style={{ marginBottom: 32 }}>
          <Button color="primary" variant="outlined" onClick={cancel} style={{ marginRight: 24 }}>Cancel</Button>
          <Button color="primary" variant="contained" className={classes.btn} onClick={submit}>Submit</Button>
        </FlexDiv>
      </FlexDiv>
    </Dialog>
  )
}

export default WasteTableDialog;
