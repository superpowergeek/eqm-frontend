import React from 'react';
import lodashGet from 'lodash/get';

const ParagraphWrapper = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      {children.map((child, index) => {
        const block = lodashGet(child, 'props.children.props.block', undefined);
        const key = block?.getKey() || index;
        const depth = block?.getDepth();
        return (
          <div key={key} style={{ marginLeft: depth * 16 }}>
            {child}
          </div>
        );
      })}
    </React.Fragment>
  )
}

export default ParagraphWrapper;
