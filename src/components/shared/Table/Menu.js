import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default class EqmMenu extends React.PureComponent {
  state = {
    anchorEl: null,
  };

  onItemClick = (onAction, row) => (event) => {
    // event.stopPropagation();
    this.closeMenu();
    onAction(row);
  }

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  openMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const {
      row,
      options,
      component: Component,
      anchorOrigin,
      transformOrigin,
      getContentAnchorEl,
      ...others
    } = this.props;

    return (
      <React.Fragment>
        {Component
          ? <Component onClick={this.openMenu} />
          : (
            <IconButton
              onClick={this.openMenu}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={this.closeMenu}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          getContentAnchorEl={getContentAnchorEl}
          {...others}
        >
          {options.map(option => (
            <MenuItem key={option.key} onClick={this.onItemClick(option.onAction, row)}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }
}
