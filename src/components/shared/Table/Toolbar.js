import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import AddIcon from '@material-ui/icons/AddCircleOutline';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.common.white,
  },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { title, numSelected, selected, setSelected, onDelete, onDownload, onAdd } = props;

  const handleAdd = () => {
    if (!onAdd) return;
    onAdd();
  }

  const handleDelete = () => {
    if (!onDelete) return;
    onDelete(selected);
    setSelected([]);
  }

  const handleDownload = () => {
    if (!onDownload) return;
    onDownload(selected);
  }

  // TODO: should refact for expanded usage
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: (onDelete || onDownload) && numSelected > 0,
      })}
    >
      {(onDelete || onDownload) && numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          You choose {numSelected} data
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}
      {onDownload && numSelected > 0 && (
        <Tooltip title="Download">
          <IconButton aria-label="download" onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
      {onAdd && (
        <Tooltip title="Add">
          <IconButton aria-label="add" onClick={handleAdd}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
