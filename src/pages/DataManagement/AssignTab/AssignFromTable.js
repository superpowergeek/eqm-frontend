import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import types from '@constants/actions';
import { assignableTypeAmountGetter, assignableTypeAmountLabelMap, assignableTypesLabelMap } from '@constants';
import * as Selectors from 'selectors';

const AssignFromTable = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const assignedFromByCompany = useSelector(Selectors.selectAssignedFrom);
  const companyIdMap = useSelector(Selectors.selectCompanyIdMap); // self + children
  const assignedFroms = assignedFromByCompany[companyId] || {};

  const tableRows = Object.entries(assignedFroms).map(([type, { ids, idMap }]) => {
    const totalAssigned = Object.values(idMap).reduce((prev, curr) => prev + assignableTypeAmountGetter[type](curr) * curr.percent, 0 );
    const collection = ids.map(id => idMap[id]);
    return {
      id: type,
      type,
      totalAssigned,
      collection,
    }
  });
  
  React.useEffect(() => {
    if (Object.keys(assignedFroms).length > 0) return;
    dispatch({ type: types.GET_ALL_ASSIGNED_FROM, data: { companyId }});
  }, [dispatch ,assignedFroms, companyId]);

  const tableData = React.useCallback({
    rows: tableRows,
    columnSettings: [
      { key: 'type', label: 'Asset Type', sortable: false, disablePadding: false, align: 'left', renderElement: row => assignableTypesLabelMap[row.type] },
      { key: 'totalAssigned', label: 'Assigned Total', sortable: false, disablePadding: false, align: 'left', },
    ],
  }, [tableRows]);

  const renderTableExpand = React.useCallback((row) => {
    const { collection = [], type } = row;
    const expandedTableData = {
      rows: collection,
      columnSettings: [
        { 
          key: 'company', label: 'Supplier', sortable: true, disablePadding: false, align: 'left', 
          renderElement: row => companyIdMap[row.companyId].name,
        },
        { key: 'amount', label: assignableTypeAmountLabelMap[type], sortable: true, disablePadding: false, align: 'left', renderElement: assignableTypeAmountGetter[type] },
        { key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left' },
        { key: 'lastModifiedAt', label: 'Last Update', sortable: true, disablePadding: false, align: 'left', renderElement: row => moment(row.lastModifiedAt).format('YYYY/MM/DD HH:mm') },
      ],
    }
    return (
      <FlexDiv item fullWidth>
        <Table 
          data={expandedTableData}
          defaultRowsPerPage={5}
        />
      </FlexDiv>
    )
  }, [companyIdMap]);

  return (
    <FlexDiv container fullWidth fullHeight row>
      <Table 
        data={tableData} 
        expand={{
          position: 'right',
          renderExpand: renderTableExpand,
        }}  
      />
    </FlexDiv>
  )
}

export default AssignFromTable;