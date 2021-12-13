import React from 'react';
import moment from 'moment';
import { itemsPresentMap } from '@constants';
import Table from 'components/shared/Table';
import { numberWithCommas } from 'utils/functions';
import { analyticDetailCreator } from 'utils/dataParser';

const AnalyticTable = React.memo((props) => {
  const { dataSet, sourceConfig } = props;
  const { sourceCategoryMap = {}, subItems = [] } = sourceConfig || {};
  const tableData = React.useCallback({
    rows: sourceConfig ? analyticDetailCreator(dataSet, sourceCategoryMap, subItems) : [],
    columnSettings: [
      { key: 'timestamp', label: 'DATE', sortable: true, disablePadding: false, align: 'left',
        renderElement: row => moment(row.timestamp).format('ll HH:mm') },
        ...subItems.map(item => ({
        key: item,
        label: itemsPresentMap[String(item)] && itemsPresentMap[String(item)].toUpperCase(),
        sortable: true,
        disablePadding: false,
        align: 'center',
        renderElement: row => `${numberWithCommas(row[item])}`,
      })),
      {
        key: 'source', label: "Source", sortable: true, disablePadding: false, align: 'left',
      }
    ],
  }, [sourceConfig, dataSet, sourceCategoryMap, subItems]);

  return (
    <Table
      data={tableData}
      defaultRowsPerPage={5}
    />
  )
});

export default AnalyticTable;
