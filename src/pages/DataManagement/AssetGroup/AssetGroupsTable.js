import React from 'react';
import { push } from 'connected-react-router';
import { useSelector, useDispatch } from 'react-redux';
import Link from '@material-ui/core/Link';
import moment from 'moment';
import Table from 'components/shared/Table';
import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import { v4 as uuidv4 } from 'uuid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';

import types from '@constants/actions';
import { usePrevious } from 'utils/hooks';
import { updateStateComposer } from 'utils/functions';
import EmptyTab from '../EmptyTab';

const initAsset = {
  name: '',
  description: '',
  country: 'default',
  isEdit: true,
};

const AssetGroupsTable = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const assetGroupsByCompanyId = useSelector(Selectors.selectAssetGroups);
  const assetsByGroupId = useSelector(Selectors.selectAssets);
  const [assetGroupRows, setAssetGroupRows] = React.useState([]);
  const [editDescs, setEditDescs] = React.useState({});
  const [editNames, setEditNames] = React.useState({});
  const assetGroups = assetGroupsByCompanyId[companyId] || {};
  const prevAssetGroupIds = usePrevious(assetGroups.ids);
  const [isAdd, setIsAdd] = React.useState(false);

  React.useEffect(()=>{
    if (assetGroups.ids && prevAssetGroupIds !== assetGroups.ids){
      setAssetGroupRows(assetGroups.ids.map(id => assetGroups.idMap[id]));
    }
  }, [prevAssetGroupIds, assetGroups.ids, assetGroups.idMap]);

  const onClickTitle = React.useCallback((groupId) => () => {
    dispatch(push(`/data-management/assetGroup/${groupId}`));
  }, [dispatch]);

  const onAdd = () =>{
    const tmpObject ={
      ...initAsset,
      id: `tmp-${uuidv4()}`,
    }
    setIsAdd(true);
    setEditDescs(updateStateComposer(tmpObject.id, tmpObject.description));
    setEditNames(updateStateComposer(tmpObject.id, tmpObject.name));
    setAssetGroupRows(prev => [tmpObject,...prev]);
  };

  const onChange = (setter, id) => e => {
    e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const handleDelete = (rowId) => () =>{
    dispatch({
      type:types.DELETE_ASSETGROUP,
      data: {
        record:rowId
      }
    })
  };

  const handleEdit =((rowId) => () =>{
    let editingRow = {};
    setAssetGroupRows(prevAssetGroupRows => prevAssetGroupRows.map(row =>{
      if(row.id === rowId) {
        editingRow = row;
        return {
          ...editingRow,
          isEdit: true,
        }
      }
      return row;
    }));
    setEditDescs(updateStateComposer(rowId, editingRow.description));
    setEditNames(updateStateComposer(rowId, editingRow.name));
  });

  const handleCancel = (rowId) => () => {
    setIsAdd(false);
    setAssetGroupRows(rows => rows.filter(row =>{
      if(String(rowId).includes('tmp')){
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  }

  const handleCheck = (rowId) => () =>{
    setIsAdd(false);
    const description = editDescs[rowId];
    const name = editNames[rowId];
    if (String(rowId).includes('tmp')){
      return dispatch({
        type: types.ADD_ASSETGROUP,
        data: {
          companyId,
          name,
          description,
        }
      });
    }
    //update AssetGroup
    dispatch({
      type: types.UPDATE_ASSETGROUP,
      data: {
        companyId,
        description,
        name,
        recordId: rowId,
      }
    })
  };

  const tableData = {
    rows: assetGroupRows,
    columnSettings: [
      { key: 'name', label: 'Asset Group Name', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if(!row.isEdit){
            return(
                <Link color="textPrimary" onClick={onClickTitle(row.id)} variant="subtitle1" component="button">
                  {row.name}
                </Link>
            )
          }
          return(
            <TextField
              type = "text"
              value = {editNames[row.id]}
              onChange={onChange(setEditNames,row.id)}
            />
          )
        }
      },
      { key: 'assets', label: 'Assets', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => {
          return (assetsByGroupId[row.id]?.ids.length) || 0;
        }
      },
      { key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left',
        renderElement: row =>{
          if(!row.isEdit) return row.description;
          return(
            <TextField
              type = "text"
              value = {editDescs[row.id]}
              onChange = {onChange(setEditDescs,row.id)}
            />
          )
        }
      },
      { key: 'lastModifiedAt', label: 'Last Update', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm')},
      {
        key: '__ACTION__',label: 'Manipulation',sortable: false,align: 'center',
        renderElement: (row) => {
          if(!row.isEdit){
            return (
              <React.Fragment>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          };
          return(
            <React.Fragment>
              <Tooltip title="Cancel">
                <IconButton aira-label="cancel" onClick={handleCancel(row.id)}>
                  <CancelIcon/>
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
    ],
  };

  return (
    <FlexDiv column>
      { (assetGroupRows.length || isAdd) ?
      (
        <Table
          data={tableData}
          toolbarConfig={{
            title: 'Asset Group List',
            onAdd:onAdd,
          }}
        />
      ) : (
        <EmptyTab onClick={ onAdd }/>
      )
      }
    </FlexDiv>
  )

}
export default AssetGroupsTable;
