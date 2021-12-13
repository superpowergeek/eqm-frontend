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

import {companyUtilityTypesMap} from '@constants';
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

const initUtilityObject = {
  country: { id: '', name: '' },
  utilityType: '', 
  percent: 0,
  isEdit: true,
}

const UtilityTableDialog = (props) => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);

  const [utilityDatas, setUtilityDatas] = React.useState([]);
  const [utilityRows, setUtilityRows] = React.useState([]);
  const [editCountries, setEditCountries] = React.useState({id: '', name: ''});
  const [editUtilityTypes, setEditUtilityTypes] = React.useState({}); 
  const [editPercents, setEditPercents] = React.useState({});
  const [editDeprecatedDate, setEditDeprecatedDate] = React.useState('');
  const [isEdit, setIsEdit] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    if (!props.utilities) return;
    if (props.open) {
      setIsEdit(props.utilities.length ? true : false);
      setUtilityRows(props.utilities.map(c => { 
        setEditCountries(c.country);
        setEditUtilityTypes(updateStateComposer(c.id, c.type)); 
        setEditPercents(updateStateComposer(c.id, c.percent));
        setEditDeprecatedDate(c.deprecatedDate);
        return {
          ...c,
          country: {name: c.country.name, id: c.country.id},
          isEdit: true
        };
      })); 
    }
  }, [props.open, props.utilities]);

  const onAdd = () => {
    console.log({utilityRows});
    const tmpObject = {
      ...initUtilityObject,
      id: `tmp-${uuidv4()}`,
    }
    setEditUtilityTypes(updateStateComposer(tmpObject.id, tmpObject.utilityType)); 
    setEditPercents(updateStateComposer(tmpObject.id, tmpObject.percent));
    if (props.utilities.length > 0) {
      setEditDeprecatedDate(editDeprecatedDate); 
    } 
    setUtilityRows(prev => [tmpObject, ...prev]);
  };

  const submit = () => {
    let action;
    let records = {};
    Object.keys(companyUtilityTypesMap).forEach(key => {
      records[`${key}Percent`] = 0;
    })
    utilityDatas.forEach(data => {
      records[`${data.type}Percent`] = (records[`${data.type}Percent`] + data.percent) / 100;
    })
    if (props.utilities.length > 0) { // Edit utilities 
      records['deprecatedDate'] = utilityDatas[0]?.deprecatedDate; 
      action = {
        type: types.UPDATE_COMPANY_UTILITY,
        data: {
          records,
          recordId: props.utilities[0].groupId
        },
      };
    } else {
      records['companyId'] = companyId;
      records['countryId'] = utilityDatas[0]?.countryId;
      action = {
        type: types.ADD_COMPANY_UTILITY,
        data: records
      };
    }  
    if (utilityDatas.length > 0 && utilityDatas.filter(data => !data.isEdit).map(data => parseInt(data.percent)).reduce((a, b) => a + b) === 100) {
      dispatch(action);
      setUtilityRows(utilityRows.filter(data => data.isEdit));
      setUtilityDatas([]);
      props.onClose();
    } else {
      setUtilityDatas([]);
    }
  };

  const cancel = () => {
    setUtilityRows([]);
    props.onClose();
  };

  const handleCheck = (rowId) => () => { 
    const country = editCountries;
    const utilityType = editUtilityTypes[rowId]; 
    const percent = editPercents[rowId];
    const deprecatedDate = editDeprecatedDate;
    const data = {
      countryId: country.id,
      companyId,
      type: utilityType, 
      percent,
      deprecatedDate
    }

    setUtilityDatas(prev => [...prev, data]);
    if (props.utilities.length > 0) { // Edit utilities
      setUtilityRows(rows => rows.filter(row => {
        row.country = country;
        row.deprecatedDate = deprecatedDate;
        if (row.id === rowId) {
          row.type = utilityType; 
          row.percent = percent;
          row.isEdit = false;
        }
        return true;
      }));
    } else {
      // Add new utilities
      setUtilityRows(rows => rows.filter(row => {
        row.country = country;
        if (String(rowId).includes('tmp') && row.id === rowId) {
          row.type = utilityType; 
          row.percent = percent;
          row.isEdit = false;
        }
        return true;
      }));
    }
  };

  const handleCancel = (rowId) => () => {
    if (props.utilities.length > 0) { // Edit utilities
      setUtilityRows(rows => rows.filter(row => {
        return row.id !== rowId;
      }));
    } else {
      setUtilityRows(rows => rows.filter(row => {
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
    rows: utilityRows,
    columnSettings: [
      {
        key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit || props.utilities.length > 0) return editCountries.name;
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
        key: 'type', label: 'Utility Type', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return companyUtilityTypesMap[row.type];
          }
          return (
            <FlexDiv container row>
              <Select value={editUtilityTypes[row.id]} onChange={onChange(setEditUtilityTypes, row.id)}>
                {Object.entries(companyUtilityTypesMap).map(([type, name]) => (
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
            title: isEdit ? 'Edit Utility List ' : 'Add Utility List',
            onAdd: onAdd,
          }}
          data={props.utilities.length > 0 ? tableData : tableData}
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

export default UtilityTableDialog;
