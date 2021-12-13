import React from 'react';
import AddIcon from './AddIcon';
import MinusIcon from './MinusIcon';

export default ({
  className,
  direction,
  onDelete,
  onAddAfter,
  onAddBefore,
}) => (
  <span className={className}>
    <AddIcon onClick={onAddBefore} />
    {onDelete && <MinusIcon onClick={onDelete} />}
    <AddIcon onClick={onAddAfter} />
  </span>
);
