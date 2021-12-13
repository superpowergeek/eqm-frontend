import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
// import TableSortLabel from '@material-ui/core/TableSortLabel';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import { fade } from '@material-ui/core/styles/colorManipulator';

import EnhancedHead from './Head';
import EnhancedTableToolbar from './Toolbar';
import Cell from './Cell';
import FlexDiv from '../FlexDiv';
import { usePrevious } from 'utils/hooks';
import SqureChecked from 'components/Icons/SquareChecked';
import SqureUnchecked from 'components/Icons/SquareUnchecked';
import Pagination from './Pagination'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  noBorderCell: {
    borderWidth: 0,
  },
  expandableRow: {
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  tableRow: {
    '&$selected, &$selected:hover': {
      backgroundColor: fade(theme.palette.primary.main, theme.palette.action.selectedOpacity),
    },
    '&:hover': {
      backgroundColor: 'rgba(77, 182, 172, 0.2)!important'
    },
    '&:focus': {
      backgroundColor: 'rgba(77, 182, 172, 0.2)!important'
    }
  },
  selected: {
    backgroundColor: 'rgba(77, 182, 172, 0.2)!important'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const EXPAND_KEY = '__expand__';
const expandIconSetting = {
  key: EXPAND_KEY,
  label: '',
  sortable: false,
  align: 'center',
  bodyCellProps: { padding: 'none' },
  headCellProps: { padding: 'none' },
};

const EqmTable = (props) => {
  const { data, toolbarConfig, events = {}, expand, selectMode = "multiple", defaultRowsPerPage = 10 } = props;
  const { onClickRow } = events;
  const { rows, columnSettings, columnSelectMode } = data;
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [expandKey, setExpandKey] = React.useState(null);
  const [identifier, setIdentifier] = React.useState('id');
  const columnSizes = data.columnSizes && [...data.columnSizes];
  const prevExpand = usePrevious(expand);

  const expandItem = (key) => () => {
    setExpandKey(prevKey => {
      if (prevKey === key) return null;
      return key;
    });
  }

  

  if (expand && prevExpand !== expand) {
    const expandIconWidth = 4 + 48 + 4;
    if (expand.position === 'right') {
      columnSettings.push(expandIconSetting);
      if (columnSizes) columnSizes.push(expandIconWidth);
    } else {
      columnSettings.unshift(expandIconSetting);
      if (columnSizes) columnSizes.unshift(expandIconWidth);
    }
  }

  // should rerender everytime
  rows.forEach((row) => {
    row[EXPAND_KEY] = (
      <IconButton onClick={expandItem(row[identifier])} >
        {expandKey === row[identifier]
          ? <ExpandLess />
          : <ExpandMore />
        }
      </IconButton>
    );
  });

  const handleRowClick = (id, row) => () => {
    onClickRow(id, row);
    handleClick(id)();
  }

  const handleClick = (id) => (event) => {
    if (selectMode === "single") {
      setSelectedRow(id);
      return;
    }
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const sorting = (a, b) => {
    let result;
    if (b[orderBy] < a[orderBy]) {
      result = -1;
    } else if (b[orderBy] > a[orderBy]) {
      result = 1;
    } else {
      result = 0;
    }
    return result;
  };

  const sortWrapper = sortFunc => (a, b) => {
    const result = sortFunc(a, b);
    return (order === 'desc' ? result : -result);
  };
  
  if (orderBy) { // TODO: orderBy feature cause rowsPerpage number wrong
    const column = columnSettings.find(e => e.key === orderBy);
    const { sortFunction = sorting } = column || {};
    rows.sort(sortWrapper(sortFunction));
  }

  const tableBody = rows
    .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
    .map((row, index) => {
      const isItemSelected = isSelected(row.id) || selectedRow === row.id;
      return(
        <React.Fragment key={row.id}>
          <TableRow
            className={classes.tableRow}
            classes={{ selected: classes.selected }}
            role="checkbox"
            tabIndex={-1}
            key={row.id}
            onClick={onClickRow ? handleRowClick(row.id, row) : undefined}
            selected={(onClickRow || columnSelectMode) && isItemSelected}
            hover
          >
            {columnSelectMode === 'checkbox' && <Cell padding="checkbox">
              <Checkbox
                checked={isItemSelected}
                color="primary"
                onClick={handleClick(row.id)}
                icon={<SqureUnchecked />}
                checkedIcon={<SqureChecked />}
              />
            </Cell>}
            {columnSelectMode === 'radio' && <Cell padding="checkbox">
              <Radio
                checked={isItemSelected}
                color="primary"
                onClick={handleClick(row.id)}
              />
            </Cell>}
            {columnSettings.map(item => (
              <Cell
                key={item.key}
                align={item.align}
                {...item.bodyCellProps}
              >
                {item.renderElement
                  ? (
                    item.renderElement(row)
                  ) : (
                    row[item.key]
                  )
                }
              </Cell>
            ))}
          </TableRow>
          {expand && (
            <TableRow className={classes.expandableRow}>
              <Cell colSpan={columnSettings.length} padding="none" className={classes.noBorderCell}>
                <Collapse in={expandKey === row[identifier]} unmountOnExit>
                  {expand.isComp ? <expand.renderExpand row={row} /> : expand.renderExpand(row)}
                </Collapse>
              </Cell>
            </TableRow>
          )}
        </React.Fragment>
      )
    });
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  return (
    <FlexDiv column fullHeight fullWidth>
      {toolbarConfig && <EnhancedTableToolbar numSelected={selected.length} selected={selected} setSelected={setSelected} {...toolbarConfig} />}
      <TableContainer>
        <Table>
          <EnhancedHead
            columnSelectMode={columnSelectMode}
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            headers={columnSettings}
          />
          <TableBody>
            {tableBody}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <Cell colSpan={columnSelectMode ? columnSettings.length + 1 : columnSettings.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {rows.length !== 0 && 
        <Pagination 
          count={ rows.length }
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsChange={handleChangeRowsPerPage}
        />
      }
    </FlexDiv>
  );
}

EqmTable.propTypes = {
  data: PropTypes.shape({
    rows: PropTypes.array,
    columnSettings: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      // a function takes order as a parameter and return a sort function
      // e.g. order => (row1, row2) => row1.id > row2.id
      align: PropTypes.oneOf(['left', 'right', 'center']),
      bodyCellProps: PropTypes.object,
      headCellProps: PropTypes.object,
      renderElement: PropTypes.func,
    })),
    columnSelectMode: PropTypes.oneOf(['checkbox', 'radio', undefined]),
  }),
  defaultRowsPerPage: PropTypes.oneOf([5, 10, 25]),
  selectMode: PropTypes.oneOf(['single', 'multiple']),
  
  // TODO: update later
  expand: PropTypes.any,
  toolbarConfig: PropTypes.any,
  events: PropTypes.any,
}

export default EqmTable;
