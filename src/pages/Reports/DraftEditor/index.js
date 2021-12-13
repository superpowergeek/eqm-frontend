import 'draft-js/dist/Draft.css';
import 'draft-js-alignment-plugin/lib/plugin.css';
import 'components/draft/table-plugin/plugin.css';
import React from 'react';
import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { goBack } from 'connected-react-router';
import { 
  // ContentState,
  Modifier,
  // genKey,
  // SelectionState,
  // ContentBlock,
  getDefaultKeyBinding,
  DefaultDraftBlockRenderMap,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
} from 'draft-js';
import debounce from 'lodash/debounce';
import Editor, { composeDecorators } from 'draft-js-plugins-editor';
import createResizeablePlugin from 'draft-js-resizeable-plugin';
import createFocusPlugin from 'draft-js-focus-plugin';
import createImagePlugin from 'draft-js-image-plugin';
import createAlignmentPlugin from 'draft-js-alignment-plugin';
import { createTablePlugin, AddTable } from 'components/draft/table-plugin';
import Immutable from 'immutable';

import { customTypes } from '@constants/editor';
import types from '@constants/actions';
import FlexDiv from 'components/shared/FlexDiv';
import * as Selectors from 'selectors';
import { addCompanyImage } from 'sagas/apis';
import SideToolbar, { sideToolbarPlugin } from 'components/draft/CustomSideBar';
import AnchorWrapper from 'components/draft/wrappers/AnchorWrapper';
import ParagraphWrapper from 'components/draft/wrappers/ParagraphWrapper';

import AnalyticDialog from '../EditReport/AnalyticDialog';
import composeFocusPlugin from './composeFocusPlugin';
import customOntab from './customOntab';
const focusPlugin = createFocusPlugin();
const imagePlugin = createImagePlugin();
const alignmentPlugin = createAlignmentPlugin();
const { AlignmentTool } = alignmentPlugin;
const resizeablePlugin = createResizeablePlugin();
const decorator = composeDecorators(
  focusPlugin.decorator,
  resizeablePlugin.decorator,
  alignmentPlugin.decorator,
);

const styleMap = {
  'HIGHLIGHT': {
    backgroundColor: '#F04A23',
    color: '#fff',
    paddingLeft: 2,
    paddingRight: 2,
  }
}
const blockfocusPlugin = composeFocusPlugin({ decorator });

const blockRenderMap = Immutable.Map({
  'header-one': {
    // element is used during paste or html conversion to auto match your component;
    // it is also retained as part of this.props.children and not stripped out
    element: 'h1',
    wrapper: <AnchorWrapper level={'h1'} />,
  },
  'header-two': {
    element: 'h2',
    wrapper: <AnchorWrapper level={'h2'} />,
  },
  'header-three': {
    element: 'h3',
    wrapper: <AnchorWrapper level={'h3'} />,
  },
  'unstyled': {
    element: 'div',
    aliasedElements: ['p'],
    wrapper: <ParagraphWrapper />,
    // When Draft parses pasted HTML, it maps from HTML elements back into Draft block types. 
    // If you want to specify other HTML elements that map to a particular block type, 
    // you can add the array aliasedElements to the block config.
  },
  'atomic': {
    element: 'div',
  },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
class DraftEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { 
      chartDialogOpen: false,
      tableDialogOpen: false,
      readOnly: false,
    };
  }

  onToggleReadOnly = readOnly => {
    this.setState({
      readOnly,
    });
  };

  keyBindingFn = (e) => {
    const { editorState, updateEditState } = this.props;
    if (e.metaKey && e.key === 'h') {
      return 'highlight';
    }
    if (e.keyCode === 9) {
      const newState = customOntab(e, editorState, 4)
      if (newState !== editorState) {
        return updateEditState(newState);
      }
    }
    return getDefaultKeyBinding(e);
  }

  addSimpleTable = () => {
    const { editorState } = this.props

    const contentState = editorState.getCurrentContent();
    const columns = ['test1', 'test2', 'test3'];
    const rows = [{ 0: "row11", 1: "row12", 2: "row13" }, { 0: "row21", 1: "row22", 2: "row23" }, { 0: "row31", 1: "row32", 2: "row33" }];
    const columnsMapped = columns.map((value, i) => ({
      key: `Column${i}`,
      value: value || `Column${i}`
    }))

    const rowsMapped = rows.map((row, i) => ({
      key: `Row${i}`,
      value: Object.keys(row).map(key => ({
        key: `Cell-${key}`,
        value: row[key] || `Cell${key}`,
      })),
    }))

    const contentStateWithEntity = contentState.createEntity(
      'draft-js-table-plugin',
      'IMMUTABLE',
      { columns: columnsMapped, rows: rowsMapped }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    this.onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '));
  }
  addMetric = () => {
    const { editorState, updateEditState } = this.props;
    
    const text = "This is input text with blockType"
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const modifiedText = Modifier.insertText(contentState, selection, text);
    const typeText = Modifier.setBlockType(
      modifiedText,
      modifiedText.getSelectionAfter(),
      'header-one',
    )
    updateEditState(EditorState.push(editorState, typeText, 'insert-fragment'));

    // const newBlock = new ContentBlock({
    //   key: genKey(),
    //   type: 'header-one',
    //   text: 'hello world',
    //   characterList: List(),
    // });

    // const contentState = editorState.getCurrentContent();
    // const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock);
    // const editorWithBlock = EditorState.push(
    //   editorState,
    //   ContentState.createFromBlockArray(newBlockMap.toArray())
    // );
    // updateEditState(EditorState.moveFocusToEnd(editorWithBlock));
  }

  onAddImage = async (event) => {
    if (!event.target.files[0]) return;
    const { companyId } = this.props;
    try {
      const { data } = await addCompanyImage({
        companyId,
        file: event.target.files[0],
      });
      const { url } = data;
      const { editorState, updateEditState } = this.props
      const currentContent = editorState.getCurrentContent();
      const payload = {
        src: url,
      }
      const contentStateWithEntity = currentContent.createEntity("IMAGE", 'IMMUTABLE', payload);
  
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
      const newEditorState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        entityKey,
        " "
      )
      updateEditState(newEditorState);
    } catch (e) {
      console.warn('UploadImage Error', e);
    }
  }

  handleKeyCommand = (command) => {
    const { editorState } = this.props;
    if (command === 'highlight') {
      this.onChange(RichUtils.toggleInlineStyle(editorState, 'HIGHLIGHT'));
      return true;
    }
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  onOpenChartDialog = () => {
    this.setState({
      chartDialogOpen: true,
    });
  }

  onOpenTableDialog = () => {
    this.setState({
      tableDialogOpen: true,
    })
  }

  onCloseChartDialog = () => {
    this.setState({
      chartDialogOpen: false,
    })
  }
  
  onCloseTableDialog = () => {
    this.setState({
      tableDialogOpen: false,
    })
  }

  onAddDivider = () => {
    const { editorState, updateEditState } = this.props
    const currentContent = editorState.getCurrentContent();
    const contentStateWithEntity = currentContent.createEntity(customTypes.DIVIDER, 'IMMUTABLE', {});

    const contentStateWithLink = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      contentStateWithLink,
      entityKey,
      " "
    )
    updateEditState(newEditorState);
  }
  onApplyTableContent = () => (chartId) => {
    const { editorState, updateEditState } = this.props
    const currentContent = editorState.getCurrentContent();
    const payload = {
      chartId,
    }
    const contentStateWithEntity = currentContent.createEntity(customTypes.TABLE, 'IMMUTABLE', payload);

    const contentStateWithLink = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      contentStateWithLink,
      entityKey,
      " "
    )
    updateEditState(newEditorState);
    this.setState({
      tableDialogOpen: false,
    });
  }
  onApplyChartContent = () => (chartId) => {
    const { editorState, updateEditState } = this.props;
    const currentContent = editorState.getCurrentContent();
    const payload = {
      chartId,
      parentHeight: 300,
    }
    const contentStateWithEntity = currentContent.createEntity(customTypes.CHART, 'IMMUTABLE', payload);

    const contentStateWithLink = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      contentStateWithLink,
      entityKey,
      " "
    )
    updateEditState(newEditorState);
    this.setState({
      chartDialogOpen: false,
    });
  }

  focus() {
    this.refs.editor.focus();
  }
  
  saveReport = async () => {
    const { updateUserReport } = this.props;
    try {
      const { report: updatedReport } = await updateUserReport();
      this.props.setIsEditing(false);
    } catch (e) {
      console.warn("Save Report Failed");
    }
  }

  onChange = (editorState) => {
    this.props.setIsEditing(true);
    this.props.updateEditState(editorState);
    debounce(this.saveReport, 5000)();
  }

  onCancel = () => {
    this.props.goBack();
  }

  render() {
    const { 
      chartDialogOpen,
      tableDialogOpen,
    } = this.state;

    const tablePlugin = createTablePlugin({ onToggleReadOnly: this.onToggleReadOnly });
    const { editorState } = this.props;
    return (
      <FlexDiv fullWidth item column ref={(ref) => this.rootRef = ref}>
        {/* <button onClick={this.addSimpleTable}>Metric</button>
        <AddTable editorState={editorState} onChange={this.onChange} /> */}
        <Editor
          plugins={[alignmentPlugin, imagePlugin, focusPlugin, resizeablePlugin, blockfocusPlugin, sideToolbarPlugin, tablePlugin]}
          editorState={editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
          keyBindingFn={this.keyBindingFn}
          blockRenderMap={extendedBlockRenderMap}
          customStyleMap={styleMap}
          ref="editor"
          readOnly={this.state.readOnly}
          spellCheck={true}
        />
        <SideToolbar 
          onAddChart={this.onOpenChartDialog}
          onAddTable={this.onOpenTableDialog}
          onAddImage={this.onAddImage}
          onAddDivider={this.onAddDivider}
        />
        <AlignmentTool />
        <AnalyticDialog
          mode="Chart"
          open={chartDialogOpen}
          onClose={this.onCloseChartDialog}
          onApply={this.onApplyChartContent()}
        />
        <AnalyticDialog
          mode="Table"
          open={tableDialogOpen}
          onClose={this.onCloseTableDialog}
          onApply={this.onApplyTableContent()}
        />
      </FlexDiv>
    );
  }
}


const mapStateToProps = createStructuredSelector({
  editorState: Selectors.selectReportCurrentReportEditState,
  report: Selectors.selectReportCurrentReport,
  companyId: Selectors.selectUserCompanyId,
})

const mapDispatchToProps = (dispatch) => ({
  goBack: (path) => dispatch(goBack(path)),
  updateEditState: (editorState) => dispatch({
    type: types.UPDATE_USER_REPORT_CURRENT_REPORT,
    data: {
      content: editorState,
    },
  }),
  updateUserReport: (data) => dispatch({
    type: types.UPDATE_USER_REPORT,
    [WAIT_FOR_ACTION]: types.UPDATE_USER_REPORT_SUCCESS,
    [ERROR_ACTION]: types.UPDATE_USER_REPORT_ERROR,
    data,
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(DraftEditor);