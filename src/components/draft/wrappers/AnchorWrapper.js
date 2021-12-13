import React from 'react';
import lodashGet from 'lodash/get';
// import { usePrevious } from 'utils/hooks';

const AnchorWrapper = (props) => {
  const { children } = props;
  return (
    <React.Fragment>
      {children.map((child, index) => {
        const block = lodashGet(child, 'props.children.props.block', undefined);
        const key = block?.getKey() || '';
        return (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a id={key} key={key}>
            {child}
          </a>
        );
      })}
    </React.Fragment>
  )
}

export default AnchorWrapper;
