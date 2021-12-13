import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles(theme => ({
  root: {},
  alignCenter: {
    textAlign: 'center',
  },
  alignRight: {
    textAlign: 'right',
  },
  alignLeft: {
    textAlign: 'left',
  },
  head: {
    fontSize: theme.typography.pxToRem(16),
  },
  ellipsis: theme.div.ellipsisText,
  complete: theme.div.breakAllText,
}));

const Cell = (props) => {
  const rootClasses = useStyles();
  const { classes = {}, align, children, useEllipsis, ...others } = props;
  return (
    <TableCell
      classes={{
        root: clsx(
          rootClasses.root,
          {
            [rootClasses.alignCenter]: align && align === 'center',
            [rootClasses.alignRight]: align && align === 'right',
            [rootClasses.alignLeft]: align && align === 'left',
            [rootClasses.ellipsis]: !!(useEllipsis),
            // [rootClasses.complete]: !!(displayComplete),
          }
        ),
        head: classes.head,
      }}
      {...others}
    >
      {children}
    </TableCell>
  )
}

export default Cell;
