import React from 'react';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { push, goBack } from 'connected-react-router';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import types from '@constants/actions';
import { unitMap } from '@constants'
import { assignableTypes, assignableTypesLabelMap } from '@constants';
import * as Selectors from 'selectors';
import { numberWithCommas } from 'utils/functions';

import AssetEngineTable from './AssetEngineTable';
import AssetRefrigeratorTable from "./AssetRefrigeratorTable";
import PrevDefaultButton from 'components/shared/PrevDefaultButton';
import SubTabs from 'components/shared/SubTabs';

const sharedSettings = [
  { key: 'total', label: 'Total', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.total == "-" ? row.total : `${row.total}(${unitMap[row.type]})`},
  { key: 'Q1', label: 'Q1', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.Q1 == "-" ? row.Q1 : `${row.Q1}(${unitMap[row.type]})`},
  { key: 'Q2', label: 'Q2', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.Q2 == "-" ? row.Q2 : `${row.Q2}(${unitMap[row.type]})`},
  { key: 'Q3', label: 'Q3', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.Q3 == "-" ? row.Q3 : `${row.Q3}(${unitMap[row.type]})`},
  { key: 'Q4', label: 'Q4', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.Q4 == "-" ? row.Q4 : `${row.Q4}(${unitMap[row.type]})`}
];

const AssetTable = (props) => {
  const { assetGroupId, assetId, leaseAssetId } = props;
  const dispatch = useDispatch();
  const assetWaste = useSelector(Selectors.selectAssetWaste)[assetId] || {};
  const assetFuelConsumption = useSelector(Selectors.selectAssetFuelConsumption)[assetId] || {};
  const assetUtility = useSelector(Selectors.selectAssetUtility)[assetId] || {};
  const assetRefrigeratorConsumption = useSelector(Selectors.selectAssetRefrigeratorConsumption)[assetId] || {};
  const [subTabValue, setSubTabValue] = React.useState(0);

  const handleSubTabChange = (e, value) => setSubTabValue(value);
  React.useEffect(() => {
    if (Object.keys(assetFuelConsumption).length !== 0 || Object.keys(assetWaste).length !== 0 || Object.keys(assetUtility).length !== 0 || Object.keys(assetRefrigeratorConsumption).length !== 0) return;
    dispatch({ type: types.GET_ASSET_ALL_PRODUCTS, data: { assetId }});
  }, [dispatch, assetId, assetFuelConsumption, assetWaste, assetUtility, assetRefrigeratorConsumption]);

  const onClickTitle = React.useCallback((type) => () => {
    dispatch(push(`/data-management/assetGroup/${assetGroupId}/${assetId}/${leaseAssetId}/${type}`))
  }, [dispatch, assetId, assetGroupId, leaseAssetId]);

  const tableData = React.useCallback({
    rows: [
      {
        id: assignableTypes.FUEL_CONSUMPTION,
        type: assignableTypes.FUEL_CONSUMPTION,
        total: numberWithCommas(assetFuelConsumption.total || '-'),
        Q1: numberWithCommas(assetFuelConsumption.Q1 || '-'),
        Q2: numberWithCommas(assetFuelConsumption.Q2 || '-'),
        Q3: numberWithCommas(assetFuelConsumption.Q3 || '-'),
        Q4: numberWithCommas(assetFuelConsumption.Q4 || '-'),
      },
      {
        id: assignableTypes.WASTE,
        type: assignableTypes.WASTE,
        total: numberWithCommas(assetWaste.total || '-'),
        Q1: numberWithCommas(assetWaste.Q1 || '-'),
        Q2: numberWithCommas(assetWaste.Q2 || '-'),
        Q3: numberWithCommas(assetWaste.Q3 || '-'),
        Q4: numberWithCommas(assetWaste.Q4 || '-'),
      },
      {
        id: assignableTypes.UTILITY,
        type: assignableTypes.UTILITY,
        total: numberWithCommas(assetUtility.total || '-'),
        Q1: numberWithCommas(assetUtility.Q1 || '-'),
        Q2: numberWithCommas(assetUtility.Q2 || '-'),
        Q3: numberWithCommas(assetUtility.Q3 || '-'),
        Q4: numberWithCommas(assetUtility.Q4 || '-'),
      },
      {
        id: assignableTypes.REFRIGERATOR_CONSUMPTION,
        type: assignableTypes.REFRIGERATOR_CONSUMPTION,
        total: numberWithCommas(assetRefrigeratorConsumption.total || '-'),
        Q1: numberWithCommas(assetRefrigeratorConsumption.Q1 || '-'),
        Q2: numberWithCommas(assetRefrigeratorConsumption.Q2 || '-'),
        Q3: numberWithCommas(assetRefrigeratorConsumption.Q3 || '-'),
        Q4: numberWithCommas(assetRefrigeratorConsumption.Q4 || '-'),
      },
    ],
    columnSettings: [
      { 
        key: 'type', label: 'Data Name', sortable: false, disablePadding: false, align: 'left',
        renderElement: row => 
          (
            <Link color="textPrimary" onClick={onClickTitle(row.type)} variant="subtitle1" component="button">
              {assignableTypesLabelMap[row.type]}
            </Link>
          )
      },
      ...sharedSettings,
    ],
  }, [assetFuelConsumption, assetWaste, assetUtility, assetRefrigeratorConsumption])

  const onPrevpage = () => dispatch(goBack());
  const labels = ['Asset Data', 'Asset Engine', 'Asset Refrigerator'];
  return (
    <FlexDiv column fullHeight fullWidth>
      <FlexDiv row crossAlign="center" fullHeight>
        <PrevDefaultButton onClick={onPrevpage} />
        <Typography>Asset Data</Typography>
      </FlexDiv>
      <SubTabs labels={labels} value={subTabValue} handleChange={handleSubTabChange} />
      {subTabValue === 0 && <Table data={tableData} />}
      {subTabValue === 1 && <AssetEngineTable assetId={assetId} />}
      {subTabValue === 2 && <AssetRefrigeratorTable assetId={assetId} />}
    </FlexDiv>
  )
}

export default AssetTable;
