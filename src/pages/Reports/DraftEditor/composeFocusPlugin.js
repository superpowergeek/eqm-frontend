
import 'draft-js-focus-plugin/lib/plugin.css';
import 'draft-js-image-plugin/lib/plugin.css';
import AtomicComponent from './AtomicComponent';

const composeFocusPlugin = (config = {}) => {
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        return {
          component: config.decorator ? config.decorator(AtomicComponent) : AtomicComponent,
          editable: (type === 'IMAGE' || type === 'image') ? true : false,
        };
      }
      return null;
    },
  };
};

export default composeFocusPlugin;