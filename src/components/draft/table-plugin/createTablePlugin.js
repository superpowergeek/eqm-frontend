import decorateComponentWithProps from 'decorate-component-with-props';
import DefaultTableComponent from './components/Table';
import * as types from './constants';
import tableStyles from './tableStyles.css';
import {
  editColumn,
  editCell,
  removeRow,
  addRow,
  addColumn,
  removeColumn,
} from './modifiers/editTable';

const defaultTheme = tableStyles;
export default (
  { tableComponent, onToggleReadOnly, theme, decorator } = {}
) => {
  const tableTheme = theme || defaultTheme;
  let Table = tableComponent || DefaultTableComponent;
  if (decorator) {
    Table = decorator(Table);
  }
  const ThemedTable = decorateComponentWithProps(Table, {
    theme: tableTheme,
    onToggleReadOnly,
  });

  return {
    blockRendererFn: (block, { getEditorState, setEditorState }) => {
      if (block.getType() === types.ATOMIC) {
        try {
          // TODO subject to change for draft-js next release
          const contentState = getEditorState().getCurrentContent();
          const entity = contentState.getEntity(block.getEntityAt(0));
          if (!entity) {
            return null;
          }
          const type = entity.getType();
          const { columns, rows } = entity.getData();
          if (type === types.TABLETYPE) {
            return {
              component: ThemedTable,
              editable: true,
              props: {
                columns,
                rows,
                getEditorState,
                setEditorState,
                editColumn,
                editCell,
                addColumn,
                removeColumn,
                removeRow,
                addRow,
              },
            };
          }
        } catch (e) {
          return null;
        }
      }

      return null;
    },
    types,
  };
};
