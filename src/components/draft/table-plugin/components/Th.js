import React from 'react';
import clsx from 'clsx';
import InputCell from './InputCell';
import EditButtons from './EditButtons';

export default class Th extends React.Component {
  render() {
    const {
      value,
      onChange,
      onToggleReadOnly,
      onAddColumnLeft,
      onAddColumnRight,
      onRemoveColumn,
      theme,
    } = this.props;
    return (
      <th className={theme.th}>
        <InputCell
          theme={theme}
          onChange={onChange}
          value={value}
          textAreaStyle={clsx(theme.columnTextArea, "draftJsStickerPlugin__columnTextArea__3H8F8")}
          onToggleReadOnly={onToggleReadOnly}
          render={({ showEditOptions }) =>
            showEditOptions && (
              <EditButtons
                className={clsx(theme.columnButtons, "draftJsStickerPlugin__columnButtons__2FfmA")}
                onAddBefore={onAddColumnLeft}
                onDelete={onRemoveColumn}
                onAddAfter={onAddColumnRight}
              />
            )
          }
        />
      </th>
    );
  }
}
