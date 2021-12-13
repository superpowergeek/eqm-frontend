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
import EditIcon from "@material-ui/icons/Edit";
import { v4 as uuidv4 } from 'uuid';

import types from '@constants/actions';
import { categoryTypesMap } from '@constants';
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

const initPurchaseObject = {
  category: 0,
  spendCost: 0,
  name: '',
  amount: 0,
  country: { id: '', name: '' },
  time: moment(),
  isEdit: true,
}

const PurchasesTab = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const purchasesBycompanyId = useSelector(Selectors.selectPurchases) || {};
  const purchases = purchasesBycompanyId[companyId] || {};
  const spendCostOptions = useSelector(Selectors.selectSpendCost) || [];
  const [purchasesRows, setPurchasesRows] = React.useState([]);
  const prevPurchaseIds = usePrevious(purchases.ids);

  const [editCategories, setEditCategories] = React.useState({});
  const [editSpendCosts, setEditSpendCosts] = React.useState({});
  const [editNames, setEditNames] = React.useState({});
  const [editAmounts, setEditAmounts] = React.useState({});
  const [editCountries, setEditCountries] = React.useState({id: '', name: ''});
  const [editTimes, setEditTimes] = React.useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState(null);

  React.useEffect(() => {
    if (purchases.ids && prevPurchaseIds !== purchases.ids) {
      setPurchasesRows(purchases.ids.map(id => purchases.idMap[id]));
    }
  }, [prevPurchaseIds, purchases.ids, purchases.idMap]);

  React.useEffect(() => {
    if (purchases.ids) return;
    dispatch({ type: types.GET_COMPANY_PURCHASES });
  }, [dispatch, purchases.ids]);

  React.useEffect(() => {
    if (spendCostOptions.length > 0) return;
    dispatch({ type: types.GET_SPENDCOSTS });
  }, [dispatch, spendCostOptions])

  const onAdd = () => {
    const tmpObject = {
      ...initPurchaseObject,
      id: `tmp-${uuidv4()}`,
    }
    setEditCategories(updateStateComposer(tmpObject.id, tmpObject.category));
    setEditSpendCosts(updateStateComposer(tmpObject.id, tmpObject.spendCost));
    setEditNames(updateStateComposer(tmpObject.id, tmpObject.name));
    setEditAmounts(updateStateComposer(tmpObject.id, tmpObject.amount));
    setEditCountries(updateStateComposer(tmpObject.id, tmpObject.country));
    setEditTimes(updateStateComposer(tmpObject.id, tmpObject.time));

    setPurchasesRows(prev => [tmpObject, ...prev]);
  }

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const onCountryChange = (setter, rowId, id, name)  => {
    setter(updateStateComposer(rowId, {id, name}));
  };

  const onTimeChange = (setter, id) => (date) => {
    setter(updateStateComposer(id, date));
  };

  const handleCheck = (rowId) => () => {
    const name = editNames[rowId];
    const spendCostId = editSpendCosts[rowId];
    const amount = editAmounts[rowId];
    const country = editCountries[rowId];
    const time = editTimes[rowId] && editTimes[rowId].format('x');
    if (String(rowId).includes('tmp')) {
      dispatch({
        type: types.ADD_COMPANY_PURCHASES,
        data: {
          companyId,
          name,
          spendCostId,
          amount,
          countryId: country.id,
          time
        }
      })
    } else {
      const records = {
        companyId,
        name,
        spendCostId,
        amount,
        countryId: country.id,
        time
      }
      dispatch({
        type: types.UPDATE_COMPANY_PURCHASES,
        data: {
          records,
          recordId: rowId,
        }
      })
    }
  };

  const handleCancel = (rowId) => () => {
    setPurchasesRows(rows => rows.filter(row => {
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
      type: types.DELETE_COMPANY_PURCHASES,
      data: {
        recordId: selectedItems
      }
    })
  }, [dispatch, selectedItems]);

  const handleDelete = (rowId) => () => {
    setSelectedItems(rowId);
    setConfirmDialogOpen(true);
  };

  const handleEdit = (row) => () => {
    const currentCategory = spendCostOptions.find((spendCost) => spendCost.id === row.spendCostId)?.category;
    setEditCategories(updateStateComposer(row.id, currentCategory));
    setEditSpendCosts(updateStateComposer(row.id, row.spendCostId));
    setEditNames(updateStateComposer(row.id, row.name));
    setEditAmounts(updateStateComposer(row.id, row.amount));
    setEditCountries(updateStateComposer(row.id, row.country));
    setEditTimes(updateStateComposer(row.id, moment(row.time)));

    setPurchasesRows(prev => {
      return prev.map(object => {
        if (object.id === row.id) {
          object.isEdit = true;
        }
        return object;
      })
    });
  }

  const tableData = {
    rows: purchasesRows,
    columnSettings: [
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') },
      { key: 'spendCostCategory', label: 'Spend Cost Category', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit) {
            return categoryTypesMap[spendCostOptions.find((spendCost) => spendCost.id === row.spendCostId)?.category];
          }
          return (
            <FlexDiv container row>
              <Select value={editCategories[row.id]} onChange={onChange(setEditCategories, row.id)}>
                {Object.entries(categoryTypesMap).map(([typeId, name]) => (<MenuItem key={typeId} value={typeId}>{name}</MenuItem>))}
              </Select>
            </FlexDiv>
          )
        }
      },
      { key: 'spendCostName', label: 'Spend Cost Name', sortable: false, disablePadding: false, align: 'left',
        bodyCellProps: {
          useEllipsis: true,
        },
        renderElement: row => {
          if (!row.isEdit) {
            return spendCostOptions.find((spendcostObject) => spendcostObject.id === row.spendCostId)?.name
          }
          return (
            <FlexDiv container row>
              <Select value={editSpendCosts[row.id]} onChange={onChange(setEditSpendCosts, row.id)}>
                {(spendCostOptions.filter((spendcostObject) => spendcostObject.category == editCategories[row.id]) || []).map((obj) => (<MenuItem key={obj.id} value={obj.id}>{obj.name}</MenuItem>))}
              </Select>
            </FlexDiv>
          )
        }
      },
      { key: 'name', label: 'Name', sortable: true, disablePadding: false, align: 'left',
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
      { key: 'amount', label: 'Amount', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) return `${row.amount}(US$)`;
          return (
            <TextField
              type="number"
              value={editAmounts[row.id]}
              onChange={onChange(setEditAmounts, row.id)}
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
        key: 'time', label: 'Time', sortable: true, disablePadding: false, align: 'left',
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
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row)}>
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
          <TableTabs value={4}/>
          <FlexDiv row fullWidth fullHeight>
            <FlexDiv item fullHeight style={{ flex: 3 }}>
              <Table
                toolbarConfig={{
                  title: 'Purchased Items',
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
            title={"Are you sure to delete selected purchase ?"}
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

export default PurchasesTab;
