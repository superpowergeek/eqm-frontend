import React from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'connected-react-router';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import * as Selectors from 'selectors';
import PrevDefaultButton from 'components/shared/PrevDefaultButton';

const LeaseAssetTable = (props) => {

  const { assetGroupId, assetId } = props;
  const assetsByGroupId = useSelector(Selectors.selectAssets); 
  const assets = assetsByGroupId[assetGroupId] || {};
  const [leaseAsset, setLeaseAsset] = React.useState({});
  const dispatch = useDispatch();
  React.useEffect(() => {
    setLeaseAsset(assets.idMap ? assets.idMap[assetId].leasedAsset : {});
  }, [assets.idMap, assetId])

  const tableData = {
    rows: [leaseAsset],
    columnSettings: [
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.lastModifiedAt ? moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') : ''},
      { key: 'amount', label: 'Amount', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.amount },
      { key: 'type', label: 'Emission Type', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.emission?.type },
      { key: 'name', label: 'Emission Name', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.emission?.name },
    ],
  }

  const onPrevpage = () => dispatch(goBack());

  return (
    <FlexDiv item fullHeight style={{ flex: 3 }}>
      <PrevDefaultButton onClick={onPrevpage}/>
      <Table 
        toolbarConfig={{
          title: 'Lease Asset Detail'
        }}
        data={tableData} 
      />
    </FlexDiv>
  )
}

export default LeaseAssetTable;
