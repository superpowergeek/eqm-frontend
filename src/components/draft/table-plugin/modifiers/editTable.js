import { EditorState } from 'draft-js';

export const editColumn = ({ editorState, columns, column, block }) => {
  const updated = columns.map(col => {
    if (col.key === column.key) {
      return { ...col, value: column.value };
    }
    return col;
  });
  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  const entity = contentState.getEntity(entityKey);
  const { rows } = entity.getData();

  if (!entityKey) {
    return editorState;
  }
  const updatedContentState = contentState.replaceEntityData(entityKey, {
    columns: updated,
    rows,
  });
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    'insert-fragment'
  );

  return EditorState.forceSelection(
    updatedEditorState,
    updatedEditorState.getSelection()
  );
};

export const editCell = ({ editorState, cell, row, block }) => {
  const updatedRow = row.value.map(c => {
    return {
      ...c,
      value: c.key === cell.key ? cell.value : c.value,
    };
  });

  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  const entity = contentState.getEntity(entityKey);
  if (!entity) {
    return editorState;
  }
  const { columns, rows } = entity.getData();

  const updatedRows = rows.map(r => {
    if (r.key === row.key) {
      return { key: row.key, value: updatedRow };
    }
    return r;
  });
  const updatedContentState = contentState.replaceEntityData(entityKey, {
    columns,
    rows: updatedRows,
  });
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    'insert-fragment'
  );

  return EditorState.forceSelection(
    updatedEditorState,
    updatedEditorState.getSelection()
  );
};

export const addColumn = ({ columns, rows, index, block, editorState }) => {
  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return editorState;
  }
  const newColumn = {
    key: `Column${index}Inserted${columns.length}`,
    value: '',
  };
  const updatedColumns = [
    ...columns.slice(0, index),
    newColumn,
    ...columns.slice(index),
  ];
  const updatedRows = rows.map(row => {
    const newRow = { key: `Row${index}Inserted${row.value.length}`, value: '' };
    return {
      key: row.key,
      value: [...row.value.slice(0, index), newRow, ...row.value.slice(index)],
    };
  });
  const updatedContentState = contentState.replaceEntityData(entityKey, {
    columns: updatedColumns,
    rows: updatedRows,
  });
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    'insert-fragment'
  );

  return EditorState.forceSelection(
    updatedEditorState,
    updatedEditorState.getSelection()
  );
};

export const removeColumn = ({ columns, rows, index, block, editorState }) => {
  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return editorState;
  }
  const updatedColumns =
    index > 0
      ? [...columns.slice(0, index), ...columns.slice(index + 1)]
      : columns.slice(1);
  const updatedRows = rows.map(row => {
    return {
      key: row.key,
      value:
        index > 0
          ? [...row.value.slice(0, index), ...row.value.slice(index + 1)]
          : row.value.slice(1),
    };
  });
  const updatedContentState = contentState.replaceEntityData(entityKey, {
    columns: updatedColumns,
    rows: updatedRows,
  });
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    'insert-fragment'
  );

  return EditorState.forceSelection(
    updatedEditorState,
    updatedEditorState.getSelection()
  );
};

export const addRow = ({ columns, rows, index, block, editorState }) => {
  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return editorState;
  }

  const newRow = {
    key: `InsertedRow${index}${rows.length}`,
    value: Array.from({ length: columns.length }).map((cell, i) => ({
      key: `InsertedRow${i}`,
      value: '',
    })),
  };
  const updatedRows = [...rows.slice(0, index), newRow, ...rows.slice(index)];
  const updatedContentState = contentState.replaceEntityData(entityKey, {
    columns,
    rows: updatedRows,
  });
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    'insert-fragment'
  );

  return EditorState.forceSelection(
    updatedEditorState,
    updatedEditorState.getSelection()
  );
};

export const removeRow = ({ columns, rows, index, block, editorState }) => {
  const contentState = editorState.getCurrentContent();
  const entityKey = block.getEntityAt(0);
  if (!entityKey) {
    return editorState;
  }

  const updatedRows = rows.filter((row, i) => i !== index);
  const updatedContentState = contentState.replaceEntityData(entityKey, {
    columns,
    rows: updatedRows,
  });
  const updatedEditorState = EditorState.push(
    editorState,
    updatedContentState,
    'insert-fragment'
  );

  return EditorState.forceSelection(
    updatedEditorState,
    updatedEditorState.getSelection()
  );
};
