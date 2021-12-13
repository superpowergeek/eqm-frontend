import React from 'react';
import { makeStyles, Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FlexDiv from 'components/shared/FlexDiv';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';

import AssetGroupsTable from './AssetGroupsTable';
import AssetsTable from './AssetsTable';
import AssetProducts from './AssetProducts';
import LeaseAssetTable from './LeaseAssetDetail';
import AssignableAssets from './AssignableAssets';
import TableTabs from '../TableTabs';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgb(244,247,249)',
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
}))

const AssetGroupPage = (props) => {
  const { params } = props.match;
  const { assetGroupId, assetId, leaseAssetId, assetType } = params;
  const classes = useStyles();
  const renderContent = React.useCallback((assetGroupId, assetId, leaseAssetId, assetType) => {
    if (assetType) return (<AssignableAssets assetGroupId={assetGroupId} assetId={assetId} leaseAssetId={leaseAssetId} assetType={assetType} />);
    if (assetId) {
      if (leaseAssetId == 0) return (<AssetProducts assetGroupId={assetGroupId} assetId={assetId} leaseAssetId={leaseAssetId} />);
      return (<LeaseAssetTable assetGroupId={assetGroupId} assetId={assetId} leaseAssetId={leaseAssetId} />);
    }
    if (assetGroupId) { return <AssetsTable assetGroupId={assetGroupId}/>}
    return <AssetGroupsTable />
  }, []);

  const showTabBar = !assetGroupId;
  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{ minHeight: '100%' }} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          {showTabBar && <TableTabs value={0} />}
          {renderContent(assetGroupId, assetId, leaseAssetId, assetType)}
        </Paper>
      </FlexDiv>
    </FlexDiv>)
}

export default AssetGroupPage;
