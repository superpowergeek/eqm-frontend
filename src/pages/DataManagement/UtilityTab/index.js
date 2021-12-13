import React, {useState} from 'react';
import moment from 'moment';
import {makeStyles} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

import {companyUtilityTypesMap} from '@constants';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import PageHeader from 'components/shared/PageHeader';
import AppBar from 'containers/AppBar';
import Table from 'components/shared/Table';
import FlexDiv from 'components/shared/FlexDiv';
import ConfirmContent from 'components/shared/StyledConfirmContent';
import {usePrevious} from 'utils/hooks';
import UtilityTableDialog from './UtilityTableDialog';
import EditIcon from "@material-ui/icons/Edit";
import TableTabs from "../TableTabs";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'rgb(244,247,249)'
  },
  content: {
    padding: 24,
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  paperContent: {
    border: 'none',
    boxShadow: 'rgba(193, 203, 208, 0.56) 0 1px 4px 1px ',
    marginLeft: 36,
    marginRight: 36
  }
}));

const UtilityTab = () => {
  const dispatch = useDispatch();
  const companyId = useSelector(Selectors.selectUserCompanyId);
  const utilityByCompanyId = useSelector(Selectors.selectUtility) || {};
  const utilities = utilityByCompanyId[companyId] || {};
  const prevUtilityIds = usePrevious(utilities.ids);
  const [utilityRows, setUtilityRows] = React.useState([]);

  React.useEffect(() => {
    if (utilities.ids && prevUtilityIds !== utilities.ids) {
      setUtilityRows(utilities.ids.map(id => utilities.idMap[id]));
    }
  }, [prevUtilityIds, utilities.ids, utilities.idMap]);

  React.useEffect(() => {
    if (utilities.ids) return;
    dispatch({ type: types.GET_COMPANY_UTILITY });
  }, [dispatch, utilities.ids]);

  const [utilityDialogOpen, setUtilityDialogOpen] = useState(false);
  const [utilityDetails, setUtilityDetails] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState(null);


  const closeConfirmDialog = React.useCallback(() => {
    setUtilityDialogOpen(false);
  }, []);

  const onAdd = () => {
    setUtilityDialogOpen(true);
    setUtilityDetails([]);
  }

  const handleEdit = (row) => () => {
    setUtilityDialogOpen(true);
    const utilities = [];
    Object.keys(row).forEach((key, index) => {
      if (key.includes("Percent") && row[key] !== 0) {
        const utility = {
          id: index,
          groupId: row.id,
          country: row['country'],
          type: key.replace('Percent', ''),
          percent: row[key] * 100,
          deprecatedDate: row['deprecatedDate']
        }
        utilities.push(utility);
      }
    })
    setUtilityDetails(utilities);
  }

  const classes = useStyles();

  const closeConfirmDeleteDialog = React.useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const onClickRemove = React.useCallback(() => {
    setConfirmDialogOpen(false);
    dispatch({
      type: types.DELETE_COMPANY_UTILITY,
      data: {
        recordId: selectedId
      }
    })
  }, [dispatch, selectedId]);

  const handleDelete = (rowId) => () => {
    setSelectedId(rowId);
    setConfirmDialogOpen(true);
  };


  const expandedTableData = {
    rows: utilityRows,
    columnSettings: [
      { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.country.name },
      { key: 'deprecatedDate', label: 'Deprecated Date', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.deprecatedDate ? moment(row.deprecatedDate).format('YYYY-MM-DD HH:mm') : ''},
      { key: 'lastModifiedAt', label: 'Update Time', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.lastModifiedAt ? moment(row.lastModifiedAt).format('YYYY-MM-DD HH:mm') : ''},
      {
        key: '__ACTION__',
        label: 'Manipulation', sortable: false, disablePadding: true, align: 'center', renderElement: row => {
          return (
              <React.Fragment>
                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={handleDelete(row.id)}>
                    <DeleteIcon/>
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={handleEdit(row)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
          )
        },
      },
    ]
  };

  const renderTableExpand = React.useCallback((row) => {
    const utilities = [];
    Object.keys(row).forEach(key => {
      if (key.includes("Percent") && row[key] !== 0) {
        const utility = {
          country: row['country'],
          type: key.replace('Percent', ''),
          percent: row[key],
          deprecatedDate: row['deprecatedDate'] || ''
        }
        utilities.push(utility);
      }
    })
    const expandedTableData = {
      rows: utilities,
      columnSettings: [
        { key: 'country', label: 'Country', sortable: false, disablePadding: false, align: 'left',
          bodyCellProps: {
            useEllipsis: true,
          },
          renderElement: row => {return row.country.name;}
        },
        { key: 'type', label: 'Utility Type', sortable: true, disablePadding: false, align: 'left',
          renderElement: row => companyUtilityTypesMap[row.type]
        },
        { key: 'percent', label: 'Percent', sortable: true, disablePadding: false, align: 'left', renderElement: row => row.percent * 100 },
        { key: 'deprecatedDate', label: 'Deprecated Date', sortable: false, disablePadding: false, align: 'left', renderElement: row => row.deprecatedDate ? moment(row.deprecatedDate).format('YYYY-MM-DD HH:mm') : ''}
      ],
    }

    return (
        <FlexDiv>
          <Table
              data={expandedTableData}
              selectMode="single"
              defaultRowsPerPage={5}
          />
        </FlexDiv>
    )
  },[]);

  return (
    <FlexDiv container column crossAlign="center" fullWidth className={classes.root} style={{ minHeight: '100%' }}>
      <AppBar />
      <PageHeader title="Manage Data"></PageHeader>
      <FlexDiv fullWidth style={{ minHeight: '100%' }} className={classes.content} column>
        <Paper square variant="outlined" elevation={0} className={classes.paperContent}>
          <TableTabs value={5}/>
          <FlexDiv row fullWidth fullHeight>
            <FlexDiv item fullHeight style={{ flex: 3 }}>
              <Table
                  toolbarConfig={{
                    title: 'Utility Supply',
                    onAdd: onAdd,
                  }}
                  data={expandedTableData}
                  expand={{
                    position: 'left',
                    renderExpand: renderTableExpand,
                  }}
              />
            </FlexDiv>
            <UtilityTableDialog open={utilityDialogOpen} onClose={closeConfirmDialog} utilities={utilityDetails}></UtilityTableDialog>
          </FlexDiv>
        </Paper>
        <Dialog open={confirmDialogOpen } onClose={closeConfirmDeleteDialog}>
          <ConfirmContent
            title={"Are you sure to delete selected utility ?"}
            description={'Once deleted, all data of the Asset will be gone forever.'}
            onCancel={closeConfirmDeleteDialog}
            onConfirm={onClickRemove}
            confirmLabel={"Remove"}
          />
        </Dialog>
      </FlexDiv>
    </FlexDiv>
  )
}

export default UtilityTab;
