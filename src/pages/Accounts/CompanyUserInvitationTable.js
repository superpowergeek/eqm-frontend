import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import moment from "moment";
import Dialog from '@material-ui/core/Dialog';
import types from '@constants/actions';
import ConfirmContent from 'components/shared/StyledConfirmContent';
import Table from 'components/shared/Table';
import * as Selectors from 'selectors';
import Menu from 'components/shared/Table/Menu';
import FlexDiv from "components/shared/FlexDiv";
import CompanyUserInvitationDialog from "./CompanyUserInvitationDialog";

const CompanyUserInvitationTable = () => {
  const dispatch = useDispatch();

  const companyId = useSelector(Selectors.selectUserCompanyId);
  const userInvitationsByCompany = useSelector(Selectors.selectCompanyInvitation);
  const userInvitationIds = userInvitationsByCompany?.[companyId]?.ids || [];
  const userInvitationIdMap = userInvitationsByCompany?.[companyId]?.idMap || {};

  React.useEffect(() => {
    if (userInvitationsByCompany[companyId]) return;
    dispatch({ type: types.GET_COMPANY_USER_INVITATIONS });
  }, [userInvitationsByCompany, companyId, dispatch]);

  const onEdit = () => {

  };
  
  const onDelete = (row) => {
    setSelectedItems([row.id]);
    setConfirmDialogOpen(true);
  };

  const toolBarOnDelete = React.useCallback((itemIds) => {
    setSelectedItems(itemIds);
    setConfirmDialogOpen(true);
  }, []);

  const [userInvitationDialogOpen, setUserInvitationDialog] = React.useState(false);
  const [clickedUserInvitation, setClickedUserInvitation] = React.useState(undefined);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const onCloseUserInvitationDialog = () => setUserInvitationDialog(false);
  
  const toolBarOnAdd = () => {
    setClickedUserInvitation(undefined);
    setUserInvitationDialog(true);
  }

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_COMPANY_USER_INVITATION,
      data: {
        itemIds: selectedItems
      },
    })
  }, [dispatch, selectedItems]);

  const closeConfirmDeleteDialog = () => setConfirmDialogOpen(false);

  const tableData = React.useCallback({
    rows: userInvitationIds.map(id => userInvitationIdMap[id]),
    columnSettings: [
      {
        key: 'name', label: 'Name', sortable: true, disablePadding: false, align: 'left', renderElement: row => (row.name || row.email)
      },
      {
        key: 'email', label: 'Email', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.email,
      },
      {
        key: 'role', label: 'Role', sortable: true, disablePadding: false, align: 'left',
      },
      {
        key: 'consumed', label: 'Active', sortable: true, disablePadding: false, align: 'left', renderElement: row => String(row.consumed),
      },
      { key: 'lastUpdate', label: 'Update Date', sortable: true, disablePadding: false, align: 'center', renderElement: row => moment(row.lastModifiedAt).format('ll HH:mm') },
      {
        key: '__ACTION__',
        label: 'Manipulation',
        sortable: false,
        align: 'center',
        renderElement: (row) => {
          const menuOptions = [
            {
              key: 'edit',
              label: 'Edit',
              onAction: onEdit,
            },
            {
              key: 'delete',
              label: 'Delete',
              onAction: onDelete,
            },
          ];
          return <Menu options={menuOptions} row={row} />;
        },
      },
    ],
    columnSelectMode: 'checkbox',
  }, [userInvitationIds, userInvitationIdMap]);

  return (
    <FlexDiv>
      <Table
        data={tableData}
        toolbarConfig={{
          title: 'User Inivitation List',
          onAdd: toolBarOnAdd,
          onDelete: toolBarOnDelete,
        }}
      />
      <CompanyUserInvitationDialog
        open={userInvitationDialogOpen}
        onClose={onCloseUserInvitationDialog}
        userInvitation={clickedUserInvitation}
      />
      <Dialog open={confirmDialogOpen} onClose={closeConfirmDeleteDialog}>
        <ConfirmContent
          title={"Are you sure to delete selected invitations ?"}
          onCancel={closeConfirmDeleteDialog}
          onConfirm={onClickRemove}
          confirmLabel={"Remove"}
        />
      </Dialog>
    </FlexDiv>
  )
}

export default CompanyUserInvitationTable;
