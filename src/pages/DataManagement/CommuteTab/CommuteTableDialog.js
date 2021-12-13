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

import {commuteTypesMap} from '@constants';
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

const initCommuteObject = {
  country: { id: '', name: '' },
  commuteType: '',
  description: '',
  avgDistance: 0,
  percent: 0,
  isEdit: true,
}

const CommuteTableDialog = (props) => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);

  const [commuteDatas, setCommuteDatas] = React.useState([]);
  const [commuteRows, setCommuteRows] = React.useState([]);
  const [editCountries, setEditCountries] = React.useState({id: '', name: ''});
  const [editCommuteTypes, setEditCommuteTypes] = React.useState({});
  const [editDescs, setEditDescs] = React.useState({});
  const [editAvgDistances, setEditAvgDistances] = React.useState({});
  const [editPercents, setEditPercents] = React.useState({});
  const [editDeprecatedDate, setEditDeprecatedDate] = React.useState('');
  const [isEdit, setIsEdit] = React.useState(false);

  const classes = useStyles();
  React.useEffect(() => {
    if (!props.commutes) return;
    if (props.open) {
      setIsEdit(props.commutes.length ? true : false)
      setCommuteRows(props.commutes.map(c => {
        setEditCountries(c.country);
        setEditCommuteTypes(updateStateComposer(c.id, c.type));
        setEditDescs(updateStateComposer(c.id, c.description || ''));
        setEditAvgDistances(updateStateComposer(c.id, c.averageDistance));
        setEditPercents(updateStateComposer(c.id, c.percent));
        setEditDeprecatedDate(c.deprecatedDate);    
        return {
          ...c,
          isEdit: true,
          country: {name: c.country.name, id: c.country.id},
        };
      }));
    }
  }, [props.open, props.commutes]);

  const onAdd = () => {
    const tmpObject = {
      ...initCommuteObject,
      id: `tmp-${uuidv4()}`,
    }
    setEditCountries(editCountries);
    setEditCommuteTypes(updateStateComposer(tmpObject.id, tmpObject.commuteType));
    setEditDescs(updateStateComposer(tmpObject.id, tmpObject.description));
    setEditAvgDistances(updateStateComposer(tmpObject.id, tmpObject.avgDistance));
    setEditPercents(updateStateComposer(tmpObject.id, tmpObject.percent));
    if (props.commutes.length > 0) {
      setEditDeprecatedDate(editDeprecatedDate)
    }
    setCommuteRows(prev => [tmpObject,...prev]);
  };

  const submit = () => {
    let action;
    commuteDatas.forEach(data => {
      data.percent = data.percent / 100;
    })
    if (props.commutes.length > 0) { // Edit commutes
      action = {
        type: types.UPDATE_COMPANY_COMMUTE,
        data: {
          records: commuteDatas,
          recordId: props.commutes[0].groupId
        },
      };
    } else {
      action = {
        type: types.ADD_COMPANY_COMMUTE,
        data: commuteDatas
      };
    }

    if (commuteDatas.length > 0 && commuteDatas.filter(data => !data.isEdit).map(data => parseFloat(data.percent)).reduce((a, b) => a + b) === 1) {
      dispatch(action);
      setCommuteRows(commuteRows.filter(data => data.isEdit));
      setCommuteDatas([]);
      props.onClose();
    } else {
      setCommuteDatas([]);
    }
  };

  const cancel = () => {
    setCommuteRows([]);
    props.onClose();
  };

  const handleCheck = (rowId) => () => {
    const country = editCountries;
    const commuteType = editCommuteTypes[rowId];
    const description = editDescs[rowId];
    const avgDistance = editAvgDistances[rowId];
    const percent = editPercents[rowId];
    const deprecatedDate = editDeprecatedDate;
    const data = {
      countryId: country.id,
      companyId,
      type: commuteType,
      description,
      averageDistance: avgDistance,
      percent,
      deprecatedDate
    }

    setCommuteDatas(prev => [...prev, data]);
    if (props.commutes.length > 0) { // Edit commutes
      setCommuteRows(rows => rows.filter(row => {
        row.country = country;
        row.deprecatedDate = deprecatedDate;
        if (row.id === rowId) {
          row.type = commuteType;
          row.description = description;
          row.averageDistance = avgDistance;
          row.percent = percent;
          row.isEdit = false;
        }
        return true;
      }));
    } else {
      // Add new commutes
      setCommuteRows(rows => rows.filter(row => {
        row.country = country;
        if (String(rowId).includes('tmp') && row.id === rowId) {
          row.type = commuteType;
          row.description = description;
          row.averageDistance = avgDistance;
          row.percent = percent;
          row.isEdit = false;
        }
        return true;
      }));
    }
  };

  const handleCancel = (rowId) => () => {
    if (props.commutes.length > 0) { // Edit commutes
      setCommuteRows(rows => rows.filter(row => {
        return row.id !== rowId;
      }));
    } else {
      setCommuteRows(rows => rows.filter(row => {
        if (String(rowId).includes('tmp')) {
          return row.id !== rowId;
        }
        row.isEdit = false;
        return true;
      }));
    }
  };

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
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

  const tableData = {
    rows: commuteRows,
    columnSettings: [
      {
        key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit || props.commutes.length > 0) return editCountries.name;
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
        key: 'type', label: 'Commute Type', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return commuteTypesMap[row.type];
          }
          return (
            <FlexDiv container row>
              <Select value={editCommuteTypes[row.id]} onChange={onChange(setEditCommuteTypes, row.id)}>
                {Object.entries(commuteTypesMap).map(([typeId, name]) => (
                  <MenuItem key={typeId} value={typeId}>{name}</MenuItem>))}
              </Select>
            </FlexDiv>
          )
        }
      },
      {
        key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.percent;
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
        key: 'averageDistance', label: 'Distance', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${row.averageDistance}(km)`;
          return (
            <TextField
              type="number"
              value={editAvgDistances[row.id]}
              onChange={onChange(setEditAvgDistances, row.id)}
            />
          )
        }
      },
      {
        key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left',
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
            title: isEdit ? 'Edit Commute List' : 'Add Commute List',
            onAdd: onAdd,
          }}
          data={props.commutes.length > 0 ? tableData : tableData}
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

export default CommuteTableDialog;
