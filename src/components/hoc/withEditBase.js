import React from 'react';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import Edit from '@material-ui/icons/Edit';

const withEditBase = (Comp) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      height: '100%',
      padding: 16,
      boxSizing: 'border-box',
      '&:hover': {
        border: `1px ${theme.palette.primary.main} solid`,
        borderRadius: 4,
      },
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      top: -12,
      right: -12,
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: 'white',
      }
    }
  }));

  const EditBaseComp = (props) => {
    const { onEdit, onDelete, ...rest } = props;
    const [isFocus, setIsFocus] = React.useState(false);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const containerRef = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();

    const onClickIcon = React.useCallback((e) => {
      setAnchorEl(containerRef.current);
      setIsFocus(false);
      setPopoverOpen(true);
    }, []);

    const handleClose = React.useCallback(() => {
      setPopoverOpen(false);
    }, []);
    const onMouseOver = React.useCallback(() => {
      setIsFocus(true)
    }, []);
    const onMouseOut = React.useCallback(() => setIsFocus(false), []);

    const onClickEdit = () => {
      setPopoverOpen(false);
      onEdit();
    }

    const onClickDelete = () => {
      setPopoverOpen(false);
      onDelete();
    }
    return (
      <div
        className={classes.root}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseOut}
        ref={containerRef}
        >
        <Comp {...rest} />
        {isFocus && 
          <IconButton 
            size="small"
            onClick={onClickIcon}
            disableFocusRipple disableRipple className={classes.icon}>  
            <Edit />
          </IconButton>
        }
        <Popover
          anchorEl={anchorEl}
          open={popoverOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem onClick={onClickEdit}>Edit</MenuItem>
          <MenuItem onClick={onClickDelete}>Delete</MenuItem>
        </Popover>
      </div>
    )
  }
  return EditBaseComp;
}

export default withEditBase;
