import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {v4 as uuidv4} from "uuid";
import MomentUtils from '@date-io/moment';
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Close";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CheckIcon from "@material-ui/icons/Check";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import EditIcon from "@material-ui/icons/Edit";
import * as Selectors from 'selectors';
import {updateStateComposer} from 'utils/functions';
import types from '@constants/actions';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import AutoComplete from 'components/shared/AsyncAutoComplete';

const initialSoldProduct = {
  productId: 0,
  numberSold: 0,
  time: moment(),
  country: {name: ''},
  isEdit: true
}

const SoldProductTable = (props) => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const soldProductsByCompanyId = useSelector(Selectors.selectSoldProducts) || {};
  const soldProducts = soldProductsByCompanyId[companyId] || {};

  const [soldProductRows, setSoldProductRows] = React.useState([]);
  const [editNumberSolds, setEditNumberSolds] = React.useState({});
  const [editProductIds, setEditProductIds] = React.useState({});
  const [editCountries, setEditCountries] = React.useState({});
  const [editTimes, setEditTimes] = React.useState({});

  React.useEffect(() => {
    const {idMap} = props.products;
    if (soldProducts.ids && idMap) {
      setSoldProductRows(soldProducts.ids.map(id => {
        return {
          ...soldProducts.idMap[id],
          product: idMap[soldProducts.idMap[id].productId]
        };
      }));
    }
  }, [soldProducts, props.products]);

  React.useEffect(() => {
    if (soldProducts.ids) return;
    dispatch({type: types.GET_COMPANY_SOLD_PRODUCT, data: {companyId}});
  }, [dispatch, soldProducts, companyId]);

  const onAdd = () => {
    const tmpObject = {
      ...initialSoldProduct,
      id: `tmp-${uuidv4()}`,
    }
    setEditNumberSolds(updateStateComposer(tmpObject.id, tmpObject.numberSold));
    setEditTimes(updateStateComposer(tmpObject.id, tmpObject.time));
    setEditCountries(updateStateComposer(tmpObject.id, tmpObject.country));
    setSoldProductRows(prev => [...prev, tmpObject]);
  }

  const onChange = (setter, id) => (e) => {
    if (e.persist) e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const onTimeChange = (setter, id) => (date) => {
    setter(updateStateComposer(id, date));
  };

  const handleCheck = (rowId) => () => {
    const productId = editProductIds[rowId] || props.products.ids[0];
    const numberSold = editNumberSolds[rowId];
    const country = editCountries[rowId];
    const {idMap} = props.products;

    if(String(rowId).includes('tmp')) {
      const time = editTimes[rowId] && editTimes[rowId].format('x');

      setSoldProductRows(rows => rows.filter(row => {
        if (String(rowId).includes('tmp') && row.id === rowId) {
          row.productId = productId;
          row.numberSold = numberSold;
          row.product = idMap[row.productId];
          row.country = country;
          row.time = time;
          row.isEdit = false;
        }
        return true;
      }));

      dispatch({
        type: types.ADD_COMPANY_SOLD_PRODUCT,
        data: {
          productId,
          numberSold,
          shouldAverage: true,
          countryId: country.id,
          time
        }
      });
    } else {
      const time = editTimes[rowId];
      setSoldProductRows(rows => rows.filter(row => {
        if (row.id === rowId) {
          row.numberSold = numberSold;
          row.isEdit = false;
        }
        return true;
      }));

      dispatch({
        type: types.UPDATE_COMPANY_SOLD_PRODUCT,
        data: {
          id: rowId,
          payload: {
            productId,
            numberSold,
            shouldAverage: true,
            countryId: country.id,
            time
          }
        }
      });
    }

  };

  const handleCancel = (rowId) => () => {
    setSoldProductRows(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  };

  const handleDelete = (rowId) => () => {
    dispatch({
      type: types.DELETE_COMPANY_SOLD_PRODUCT,
      data: {
        recordId: rowId,
      },
    });
  };

  const handleEdit = (rowId) => () => {
    let editingRow = {};
    setSoldProductRows(preSoldProductRows => preSoldProductRows.map(row =>{
      if(row.id === rowId) {
        setEditNumberSolds(updateStateComposer(row.id, row.numberSold));
        setEditProductIds(updateStateComposer(row.id, row.productId));
        setEditCountries(updateStateComposer(row.id, row.country));
        setEditTimes(updateStateComposer(row.id, row.time));
        editingRow = row;
        return {
          ...editingRow,
          isEdit: true,
        }
      }
      return row;
    }));
  }

  const tableData = {
    rows: soldProductRows,
    columnSettings: [
      {
        key: 'time', label: 'Time', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit || !String(row.id).includes('tmp')) return moment(row.time).format('YYYY/MM/DD HH:mm');
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
      // { key: 'shouldAverage', label: 'Should Average (Default: false)', sortable: false, disablePadding: false, align: 'left', renderElement: false},
      {
        key: 'productName',
        label: 'Product Name',
        sortable: false,
        disablePadding: false,
        align: 'left',
        renderElement: row => {
          if (!row.isEdit || !String(row.id).includes('tmp')) return row.product.name;
          return (
            <FlexDiv container row>
              <Select value={editProductIds[row.id] || props.products.ids[0] } onChange={onChange(setEditProductIds, row.id)}>
                {props.products.ids.map(id => {
                  const product = props.products.idMap[id];
                  return (
                    <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                  );
                })}
              </Select>
            </FlexDiv>
          )
        }
      },
      {
        key: 'numberSold',
        label: 'Sold Amount',
        sortable: false,
        disablePadding: false,
        align: 'left',
        renderElement: row => {
          if (!row.isEdit) return row.numberSold;
          return (
            <TextField
              type='number'
              value={editNumberSolds[row.id]}
              onChange={onChange(setEditNumberSolds, row.id)}
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
          if (!row.isEdit || !String(row.id).includes('tmp')) return row.country.name;
          return (
            <AutoComplete
              searchUrl={`/country?name=${editCountries.name}`}
              inputValue={editCountries.name}
              onInputChange={(e) => {
                e.persist();
                setEditCountries(prev => ({...prev, name: e.target.value}));
              }}
              onChange={(e, value) => {
                setEditCountries(updateStateComposer(row.id, value))
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
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            );
          }
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
    ],
  };


  return (
    <FlexDiv container fullWidth fullHeight row>
      <Table
        toolbarConfig={{
          title: 'Sold Products',
          onAdd: onAdd,
        }}
        data={tableData}
      />
    </FlexDiv>
  )
}

export default SoldProductTable;
