import React from 'react';
import clsx from 'clsx';
import TextareaAutosize from './TextArea';
const isIE = !!window.MSInputMethodContext && !!document.documentMode;
export default class InputCell extends React.Component {
  static defaultProps = {
    render: () => {},
    onShowEditOptions: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      showEditOptions: false,
    };
  }
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  onFocus = () => {
    this.props.onToggleReadOnly(true);
    this.props.onShowEditOptions(true);
    clearTimeout(this.timeout);
    this.setState({
      showEditOptions: true,
    });
  };
  onBlur = () => {
    this.props.onToggleReadOnly(false);
    this.props.onShowEditOptions(false);
    this.timeout = setTimeout(() => {
      this.setState({
        showEditOptions: false,
      });
    }, 1000);
    this.props.onChange(this.state.value);
  };
  render() {
    if (isIE) {
      return (
        <span className={clsx(this.props.theme.cellWrapper, "draftJsStickerPlugin__cellWrapper__2daOY")}>
          <texarea
            className={this.props.textAreaStyle}
            style={{ resize: 'none' }}
            type="text"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            value={this.state.value}
            onChange={this.onChange}
          />
          {this.props.render(this.state)}
        </span>
      );
    }
    // TODO: make onFocus as unique of this table
    return (
      <span className={clsx(this.props.theme.cellWrapper, "draftJsStickerPlugin__cellWrapper__2daOY")}>
        <TextareaAutosize
          useCacheForDOMMeasurements
          className={this.props.textAreaStyle}
          style={{ resize: 'none', width: '100%' }}
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={this.state.value}
          onChange={this.onChange}
        />
        {this.props.render(this.state)}
      </span>
    );
  }
}
