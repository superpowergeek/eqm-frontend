import React from 'react';
import clsx from 'clsx';
import InputCell from './InputCell';
import EditButtons from './EditButtons';

export default class RowCell extends React.Component {
  render() {
    const { value, label, onChange, onToggleReadOnly, theme } = this.props;
    return (
      <td
        data-value={value.trim()}
        data-label={label.trim()} // .trim() for white space on mobile
        className={clsx(theme.td, "draftJsStickerPlugin__td__2JrL7")}
      >
        <InputCell
          theme={theme}
          onChange={onChange}
          value={value}
          textAreaStyle={clsx(theme.rowTextArea, "draftJsStickerPlugin__rowTextArea__2mVbx")}
          onToggleReadOnly={onToggleReadOnly}
          render={({ showEditOptions }) =>
            this.props.hasEditOptions &&
            showEditOptions && (
              <EditButtons
                className={clsx(theme.rowButtons, "draftJsStickerPlugin__rowButtons__3a4nW")}
                onAddBefore={this.props.onRowAddBefore}
                onDelete={this.props.onRowDelete}
                onAddAfter={this.props.onRowAddAfter}
              />
            )
          }
        />
      </td>
    );
  }
}
