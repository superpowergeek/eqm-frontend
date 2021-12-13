import React, { Component } from 'react';
import styles from './styles.css';
import TableIcon from './TableIcon';

export default class TableAdd extends Component {
  // Start the popover closed
  state = {
    columns: 3,
    rows: 2,
    open: false,
  };

  // When the popover is open and users click anywhere on the page,
  // the popover should close
  componentDidMount() {
    document.addEventListener('click', this.closePopover);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closePopover);
  }

  // Note: make sure whenever a click happens within the popover it is not closed
  onPopoverClick = () => {
    this.preventNextClose = true;
  };

  openPopover = () => {
    if (!this.state.open) {
      this.preventNextClose = true;
      this.setState({
        open: true,
      });
    }
  };

  closePopover = () => {
    if (!this.preventNextClose && this.state.open) {
      this.setState({
        open: false,
      });
    }

    this.preventNextClose = false;
  };

  addTable = () => {
    const { editorState, onChange } = this.props;
    onChange(
      this.props.modifier(editorState, {
        columns: this.state.columns,
        rows: this.state.rows,
      })
    );
  };

  changeCols = evt => {
    this.setState({ ...this.state, columns: evt.target.value });
  };
  changeRows = evt => {
    this.setState({ ...this.state, rows: evt.target.value });
  };

  render() {
    const popoverClassName = this.state.open
      ? styles.addVideoPopover
      : styles.addVideoClosedPopover;
    const buttonClassName = this.state.open
      ? styles.addVideoPressedButton
      : styles.addVideoButton;

    return (
      <div className={styles.addVideo}>
        {!this.props.render && (
          <button
            className={buttonClassName}
            onMouseUp={this.openPopover}
            type="button"
          >
            {this.props.children && this.props.children}
            {!this.props.children && <TableIcon />}
          </button>
        )}
        {this.props.render && this.props.render({ onClick: this.openPopover })}
        <div className={popoverClassName} onClick={this.onPopoverClick}>
          <p>Add a Table</p>
          <input
            type="text"
            placeholder="Columns"
            className={styles.addVideoInput}
            onChange={this.changeCols}
            value={this.state.columns}
          />
          <input
            type="text"
            placeholder="Rows"
            className={styles.addVideoInput}
            onChange={this.changeRows}
            value={this.state.rows}
          />
          <button
            className={styles.addVideoConfirmButton}
            type="button"
            onClick={this.addTable}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
}
