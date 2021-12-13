import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from "@material-ui/icons/Edit";
import { v4 as uuidv4 } from 'uuid';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/StyledConfirmContent';
import AutoComplete from 'components/shared/AsyncAutoComplete';
import { usePrevious } from 'utils/hooks';
import { updateStateComposer } from 'utils/functions';
import TableTabs from "../TableTabs";

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

const initEmployeeObject = {
  country: { id: '', name: '' },
  number: 0,
  isEdit: true,
  isUpdate: false
}

const EmployeeTab = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const employeeBycompanyId = useSelector(Selectors.selectEmployee) || {};
  const employees = employeeBycompanyId[companyId] || {};

  const [employeeRows, setEmployeeRows] = React.useState([]);
  const prevEmployeeIds = usePrevious(employees.ids);

  const [editCountries, setEditCountries] = React.useState([]);
  const [editNumbers, setEditNumbers] = React.useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);


  React.useEffect(() => {
    if (employees.ids && prevEmployeeIds !== employees.ids) {
      setEmployeeRows(employees.ids.map(id => employees.idMap[id]));
    }
  }, [prevEmployeeIds, employees.ids, employees.idMap]);

  React.useEffect(() => {
    if (employees.ids) return;
    dispatch({ type: types.GET_COMPANY_EMPLOYEE });
  }, [dispatch, employees.ids]);

  const onAdd = () => {
    const tmpObject = {
      ...initEmployeeObject,
      id: `tmp-${uuidv4()}`,
    } 
    setEditCountries(updateStateComposer(tmpObject.id, tmpObject.country));
    setEditNumbers(updateStateComposer(tmpObject.id, tmpObject.number));

    setEmployeeRows(prev => [tmpObject, ...prev]);
  }

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const onCountryChange = (setter, rowId, id, name)  => {
    setter(updateStateComposer(rowId, {id, name}));
  };

  const handleCheck = (rowId) => () => {
    const number = editNumbers[rowId];
    const country = editCountries[rowId];

    if (String(rowId).includes('tmp')) {
      dispatch({
        type: types.ADD_COMPANY_EMPLOYEE,
        data: {
          companyId,
          number,
          countryId: country.id
        }
      })
    } else {
      const records = {
        companyId,
        number,
        countryId: country.id
      }
      dispatch({
        type: types.UPDATE_COMPANY_EMPLOYEE,
        data: {
          records,
          recordId: rowId
        }
      })

    }

    setEmployeeRows(rows => rows.filter(row => {
      if (row.id === rowId) {
        row.isEdit = false;
      }
      return true;
    }));
  };

  const handleCancel = (rowId) => () => {
    setEmployeeRows(rows => rows.filter(row => {
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
      type: types.DELETE_COMPANY_EMPLOYEE,
      data: {
        recordId: selectedId
      }
    })
  }, [dispatch, selectedId]);


  const handleDelete = (rowId) => () => {
    setSelectedId(rowId);
    setConfirmDialogOpen(true);
  };

  const handleEdit = (rowId) => () => {
    let tmpObject;
    employeeRows.forEach(employee => {
      if (employee.id === rowId) {
        tmpObject = employee;
      }
    })

    setEditCountries(updateStateComposer(rowId, { id: tmpObject.country.id, name: tmpObject.country.name }));
    setEditNumbers(updateStateComposer(tmpObject.id, tmpObject.number));

    setEmployeeRows(prev => {
      return prev.map(object => {
        if (object.id === rowId) {
          object['isEdit'] = true;
        }
        return object;
      })
    });
  }

  const tableData = {
    rows: employeeRows,
    columnSettings: [
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') },
      { key: 'number', label: 'Number of Employees', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.number;
          return (
            <TextField
              type="number"
              value={editNumbers[row.id]}
              onChange={onChange(setEditNumbers, row.id)}
            />
          )
        }
      },
      {
        key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit) return row.country.name;
          return (
            <AutoComplete
              searchUrl={`/country?name=${editCountries[row.id].name || ''}`}
              inputValue={editCountries[row.id].name || ''}
              onInputChange={(e) => {
                e.persist();
                setEditCountries(prev => ({
                  ...prev,
                  [row.id]: {
                    ...prev[row.id],
                    name: e.target.value,
                  }
                }));
              }}
              onChange={(e, value) => {
                const {name = '', id = ''} = value || {};
                onCountryChange(setEditCountries, row.id, id, name);
              }}
              getOptionLabel={(option) => {
                return `${option.name}`;
              }}
            />
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
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row.id)}>
                    <EditIcon />
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
          <TableTabs value={7}/>
          <FlexDiv row fullWidth fullHeight>
            <FlexDiv item fullHeight style={{ flex: 3 }}>
              <Table
                toolbarConfig={{
                  title: 'Employee List',
                  onAdd: onAdd,
                }}
                data={tableData}
                selectMode="single"
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

export default EmployeeTab;
