import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";

import types from '@constants/actions';
import Table from 'components/shared/Table';
import * as Selectors from 'selectors';

const CompanyUserTable = () => {
  const dispatch = useDispatch();

  const companyId = useSelector(Selectors.selectUserCompanyId);
  const usersByCompany = useSelector(Selectors.selectCompanyUser);
  const accountIds = usersByCompany?.[companyId]?.ids || [];
  const accountIdMap = usersByCompany?.[companyId]?.idMap || {};

  React.useEffect(() => {
    if (usersByCompany[companyId]) return;
    dispatch({ type: types.GET_COMPANY_USERS });
  }, [usersByCompany, companyId, dispatch]);

  const tableData = React.useCallback({
    rows: accountIds.filter(id => id !== 'tmp').map(id => accountIdMap[id]),
    columnSettings: [
      {
        key: 'name', label: 'Name', sortable: true, disablePadding: false, align: 'left', renderElement: row => (row.name || row.username)
      },
      {
        key: 'username', label: 'Account', sortable: true, disablePadding: false, align: 'left',
      },
      {
        key: 'role', label: 'Role', sortable: true, disablePadding: false, align: 'left',
      },
      { key: 'lastUpdate', label: 'Update Date', sortable: true, disablePadding: false, align: 'center', renderElement: row => moment(row.lastModifiedAt).format('ll HH:mm') },
    ],
  }, [accountIds, accountIdMap]);

  return (
    <Table
      data={tableData}
      toolbarConfig={{
        title: 'User List',
      }}
    />
  )
}

export default CompanyUserTable;
