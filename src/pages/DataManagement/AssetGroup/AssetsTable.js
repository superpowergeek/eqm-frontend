import React from 'react';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';

import Table from 'components/shared/Table';
import * as Selectors from 'selectors';
import FlexDiv from 'components/shared/FlexDiv';
import AutoComplete from 'components/shared/AsyncAutoComplete';
import { usePrevious } from 'utils/hooks';
import { updateStateComposer } from 'utils/functions';
import AddAssetDialog from './AddAssetDialog';
import PrevDefaultButton from 'components/shared/PrevDefaultButton';

// AssetsTable belong to a AssetGroup
const AssetsTable = (props) => {
  const { assetGroupId } = props;
  const dispatch = useDispatch();
  const assetsByGroupId = useSelector(Selectors.selectAssets);
  const assets = assetsByGroupId[assetGroupId] || {};
  const [assetRows, setAssetRows] = React.useState([]);
  const [editDescs, setEditDescs] = React.useState({});
  const [editNames, setEditNames] = React.useState({});
  const [editCountries, setEditCountries] = React.useState({});
  const prevAssetIds = usePrevious(assets.ids);
  const [editAsset, setEditAsset] = React.useState({});

  React.useEffect(() => {
    if (assets.ids && prevAssetIds !== assets.ids) {
      setAssetRows(assets.ids.map(id => assets.idMap[id]));
    }
  }, [assets.ids, assets.idMap, prevAssetIds]);

  const [assetDialogOpen, setAssetDialogOpen] = React.useState(false);

  const closeConfirmDialog = React.useCallback(() => {
    setAssetDialogOpen(false);
  }, []);

  const onClickTitle = React.useCallback((assetId) => () => {
    let leaseAssetId = 0;
    if (assets.idMap[assetId].leasedAsset) leaseAssetId = assets.idMap[assetId].leasedAsset.id;
    dispatch(push(`/data-management/assetGroup/${assetGroupId}/${assetId}/${leaseAssetId}`))
  }, [dispatch, assetGroupId, assets]);

  const onAdd = () => {
    setEditAsset({});
    setAssetDialogOpen(true);
  }

  const onCountryChange = (setter, rowId, id, name) => {
    setter(updateStateComposer(rowId, { id, name }));
  };

  const handleCancel = (rowId) => () => {
    setAssetRows(rows => rows.filter(row => {
      if (String(rowId).includes('tmp')) {
        return row.id !== rowId;
      }
      row.isEdit = false;
      return true;
    }));
  };

  const handleDelete = (rowId) => () => {
    console.log('delete asset id:', rowId);
    // dispatch({
    //   type: types.DELETE_ASSET,
    //   data: {
    //     recordId: rowId
    //   }
    // })
  };

  const handleEdit = ((row) => () => {
    setEditAsset(row);
    setAssetDialogOpen(true);
  });
 
  const onChange = (setter, id) => e => {
    e.persist();
    setter(updateStateComposer(id, e.target.value));
  };

  const tableData = {
    rows: assetRows,
    columnSettings: [
      { key: 'name', label: 'Asset Name', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => {
          if (!row.isEdit) {
            return (
              <Link color="textPrimary" onClick={onClickTitle(row.id)} variant="subtitle1" component="button">
                {row.name}
              </Link>
            )
          }
          return (
            <TextField
              type="text"
              value={editNames[row.id]}
              onChange={onChange(setEditNames, row.id)}
            />
          )
        }
      },
      { key: 'description', label: 'Description', sortable: false, disablePadding: false, align: 'left',
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
      { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left', 
        renderElement: row => {
          if (!row.isEdit) return (row.country && row.country.name) || 'Default';
          return (
            <AutoComplete
              searchUrl={`/country?name=${editCountries[row.id]?.name || ''}`}
              inputValue={editCountries[row.id]?.name || ''}
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
                const { name = '', id = '' } = value || {};
                onCountryChange(setEditCountries, row.id, id, name);
              }}
              getOptionLabel={(option) => {
                return `${option.name}`;
              }}
            />
          );
        },
      },
      { key: 'lastModifiedAt', label: 'Last Update', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm')},
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          return (
            <React.Fragment>
              <Tooltip title="Edit">
                <IconButton aria-label="edit" onClick={handleEdit(row)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </React.Fragment>
          )
        },
      },
    ],
  };

  const onPrevpage = () => dispatch(goBack());

  return (
    <FlexDiv>
      <FlexDiv item fullHeight style={{ flex: 3 }}>
        <PrevDefaultButton onClick={onPrevpage}/>
        <Table 
          toolbarConfig={{
            title: 'Asset List',
            onAdd: onAdd,
          }}
          data={tableData} 
        />
      </FlexDiv>
      <AddAssetDialog open={assetDialogOpen} onClose={closeConfirmDialog} assetGroupId={assetGroupId} editAsset={editAsset}></AddAssetDialog>
    </FlexDiv>
  )

}
export default AssetsTable;
