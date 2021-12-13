import { EditorState } from 'draft-js';
import adjustBlockDepthForContentState from 'draft-js/lib/adjustBlockDepthForContentState';

const customOntab = (event, editorState, maxDepth) => {
  const selection = editorState.getSelection();
  const key = selection.getAnchorKey();
  if (key !== selection.getFocusKey()) {
    return editorState;
  }

  const content = editorState.getCurrentContent();
  const block = content.getBlockForKey(key);
  const type = block.getType();
  if (type !== 'unordered-list-item' && type !== 'ordered-list-item' && type !== 'unstyled') {
    return editorState;
  }

  event.preventDefault();

  const depth = block.getDepth();
  if (!event.shiftKey && depth === maxDepth) {
    return editorState;
  }

  const withAdjustment = adjustBlockDepthForContentState(
    content,
    selection,
    event.shiftKey ? -1 : 1,
    maxDepth,
  );

  return EditorState.push(editorState, withAdjustment, 'adjust-depth');
}

export default customOntab;