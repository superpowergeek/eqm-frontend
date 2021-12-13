import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import SqureChecked from 'components/Icons/SquareChecked';
import SqureUnchecked from 'components/Icons/SquareUnchecked';
import Cell from './Cell';

const useStyles = makeStyles((theme) => ({
  header: theme.table.header, 
  headerCell: {
    fontWeight: 'bold'
  }
}));

const EnhancedTableHead = (props) => {
  const { headers, classes: classNames, onSelectAllClick, columnSelectMode, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const classes = useStyles();

  return (
    <TableHead>
      <TableRow className={clsx(classes.header, classNames.header)}>
        {columnSelectMode === 'checkbox' && <Cell padding="checkbox">
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            color="primary"
            icon={<SqureUnchecked />}
            checkedIcon={<SqureChecked />}
          />
        </Cell>}
        {columnSelectMode === 'radio' && <Cell padding="checkbox" />}
        {headers.map((headCell) => (
          <Cell
            className={classes.headerCell}
            key={headCell.key}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.key ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.key}
                direction={orderBy === headCell.key ? order : 'asc'}
                onClick={createSortHandler(headCell.key)}
              >
                {headCell.label}
                {/* {orderBy === headCell.key ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null} */}
              </TableSortLabel>
              ) : 
              headCell.label}
          </Cell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
