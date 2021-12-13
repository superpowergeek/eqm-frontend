import React from 'react';
import RowCell from './RowCell';

export default class Row extends React.Component {
  onChangeCell = ({ row, cell }) => value => {
    const {
      blockProps: { editCell, getEditorState, setEditorState },
    } = this.props;
    setEditorState(
      editCell({
        row,
        cell: { ...cell, value },
        editorState: getEditorState(),
        block: this.props.block,
      })
    );
  };
  removeRow = ({ index }) => () => {
    const {
      blockProps: { removeRow, rows, columns, getEditorState, setEditorState },
    } = this.props;
    setEditorState(
      removeRow({
        index,
        rows,
        columns,
        editorState: getEditorState(),
        block: this.props.block,
      })
    );
  };
  addRow = ({ index }) => () => {
    const {
      blockProps: { addRow, rows, columns, getEditorState, setEditorState },
    } = this.props;
    console.log('add Row', setEditorState);
    setEditorState(
      addRow({
        index,
        rows,
        columns,
        editorState: getEditorState(),
        block: this.props.block,
      })
    );
  };
  render() {
    return (
      <tr className={this.props.theme.tr}>
        {this.props.row.value.map((cell, i) => (
          <RowCell
            key={cell.key}
            hasEditOptions={i === 0}
            value={cell.value}
            label={this.props.columns[i].value}
            className={this.props.theme.td}
            theme={this.props.theme}
            onToggleReadOnly={this.props.onToggleReadOnly}
            onChange={this.onChangeCell({ row: this.props.row, cell })}
            onRowAddBefore={this.addRow({ index: this.props.rowIndex })}
            onRowDelete={
              this.props.isOnlyRow
                ? null
                : this.removeRow({ index: this.props.rowIndex })
            }
            onRowAddAfter={this.addRow({ index: this.props.rowIndex + 1 })}
          />
        ))}
      </tr>
    );
  }
}
