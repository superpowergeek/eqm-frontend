import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import types from '@constants/actions';
import { unitMap } from '@constants';
import { assignableTypeAmountGetter, assignableTypesLabelMap } from '@constants';
import * as Selectors from 'selectors';
import AssignRecordTable from './AssignRecordTable';

const AssignToTable = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const assignedToByCompany = useSelector(Selectors.selectAssignedTo);
  const assignedTos = assignedToByCompany[companyId] || {};

  const [selectedAssetType, setSelectedAssetType] = React.useState(undefined);
  const [selectedCompany, setSelectedCompany] = React.useState(undefined);
  const [selectedAssignRecords, setSelectedAssignRecords] = React.useState([]);
  const parentsCompany = useSelector(Selectors.selectCurrentParentsCompany);

  React.useEffect(() => {
    if (Object.keys(assignedTos).length > 0) return;
    dispatch({ type: types.GET_ALL_ASSIGNED_TO, data: { companyId } });
  }, [assignedTos, companyId, dispatch]);

  const tableRows = Object.entries(assignedTos).map(([assignableType, { idMap }]) => {
    const { totalAmount, assignedAmount,companyCollectionMap } = Object.values(idMap).reduce((prev, curr) => {
      const newTotal = prev.totalAmount + assignableTypeAmountGetter[assignableType](curr)
      const newAssigned = prev.assignedAmount + assignableTypeAmountGetter[assignableType](curr) * curr.percent
      
      if(!prev.companyCollectionMap[curr.companyId]) {
        prev.companyCollectionMap[curr.companyId] = {};
      }
      prev.companyCollectionMap[curr.companyId] = {
        collection: prev.companyCollectionMap[curr.companyId].collection ? [...prev.companyCollectionMap[curr.companyId].collection, curr] : [curr],
        total: prev.companyCollectionMap[curr.companyId].total ? prev.companyCollectionMap[curr.companyId].total + assignableTypeAmountGetter[assignableType](curr) : assignableTypeAmountGetter[assignableType](curr),
        assign: prev.companyCollectionMap[curr.companyId].assign ? prev.companyCollectionMap[curr.companyId].assign + assignableTypeAmountGetter[assignableType](curr) * curr.percent : assignableTypeAmountGetter[assignableType](curr) * curr.percent,
      }

      return {
        totalAmount: newTotal,
        assignedAmount: newAssigned,
        companyCollectionMap: prev.companyCollectionMap,
      }
    }, {
      totalAmount: 0,
      assignedAmount: 0,
      companyCollectionMap: {},
    });

    return {
      id: assignableType,
      type: assignableType,
      totalAmount,
      assignedAmount,
      companies: Object.entries(companyCollectionMap).map(([companyId, object]) => {
        return {
          id: companyId,
          companyId,
          ...object,
        }
      }),
    }
  })

  const tableData = React.useCallback({
    rows: tableRows,
    columnSettings: [
      { key: 'type', label: 'Asset Type', sortable: false, disablePadding: false, align: 'left', renderElement: row => assignableTypesLabelMap[row.type] },
      { key: 'assignedAmount', label: 'Assigned Total', sortable: false, disablePadding: false, align: 'left', renderElement: row => `${row.assignedAmount}(${unitMap[row.type]})` },
      { key: 'totalAmount', label: 'Total', sortable: false, disablePadding: false, align: 'left', renderElement: row => `${row.totalAmount}(${unitMap[row.type]})` },
    ],
  }, [tableRows]);

  const onClickRow = React.useCallback((assetType) => (id, row) => {
    const { collection, companyId } = row;
    setSelectedCompany(companyId);
    setSelectedAssetType(assetType);
    setSelectedAssignRecords(collection);
  }, []);

  const renderTableExpand = React.useCallback((row) => {
    const { companies = [], type } = row;
    const companyMap = parentsCompany.idMap || {};
    const expandedTableData = {
      rows: companies,
      columnSettings: [
        { key: 'company', label: 'Company', sortable: false, disablePadding: false, align: 'left', renderElement: row => companyMap[row.companyId] && companyMap[row.companyId].name },
        // { key: 'assign', label: 'Assigned Total', sortable: false, disablePadding: false, align: 'left', renderElement: row => `${row.assign}(${unitMap[row.type]})` },
        // { key: 'total', label: 'Total', sortable: false, disablePadding: false, align: 'left', renderElement: row => `${row.total}(${unitMap[row.type]})` },
        { key: 'assign', label: 'Assigned Total', sortable: false, disablePadding: false, align: 'left', },
        { key: 'total', label: 'Total', sortable: false, disablePadding: false, align: 'left', },
      ],
    }

    if (companies.length === 0) return null;
    return (
      <FlexDiv item fullWidth>
        <Table 
          data={expandedTableData}
          events={{
            onClickRow: onClickRow(type),
          }}
          selectMode="single"
          defaultRowsPerPage={5}
        />
      </FlexDiv>
    )
  }, [onClickRow, parentsCompany]);

  if (!parentsCompany || parentsCompany.ids.length === 0) {
    return (
      <FlexDiv container fullWidth height={600} mainAlign="center" crossAlign="center">
        <FlexDiv item>
          <Typography>No client available</Typography>
        </FlexDiv>
      </FlexDiv>
    )
  };

  return (
    <FlexDiv container fullWidth fullHeight row>
      <Table
        data={tableData} 
        expand={{
          position: 'right',
          renderExpand: renderTableExpand,
        }}  
      />
      <AssignRecordTable 
        rows={selectedAssignRecords}
        type={selectedAssetType}
        targetCompany={selectedCompany}
      />
    </FlexDiv>
  )
}

export default AssignToTable;