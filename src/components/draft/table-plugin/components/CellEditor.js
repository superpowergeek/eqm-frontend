import React from 'react';
import PropTypes from 'prop-types';
import { ContentState, EditorState, Editor } from 'draft-js';

export default class CellEditor extends React.Component {
  constructor(props) {
    super(props);
    const contentState =
      props.contentState || ContentState.createFromText('Content...');
    this.state = {
      editorState: EditorState.createWithContent(contentState),
    };
  }
  onChange = editorState => {
    this.props.onToggleReadOnly(true);

    this.setState({
      editorState,
    });

    this.props.onChange({
      contentState: this.state.editorState.getCurrentContent(),
    });
  };
  onClick = () => {
    this.editor.focus();
  };
  render() {
    return (
      <div onClick={this.onClick}>
        <Editor
          onBlur={this.onBlur}
          editorState={this.state.editorState}
          onChange={this.onChange}
          ref={element => {
            this.editor = element;
          }}
        />
      </div>
    );
  }
}
