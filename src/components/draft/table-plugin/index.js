import React from 'react';
import addTableModifier from './modifiers/addTable';
import AddTableComponent from './components/AddTable';

export const addTable = addTableModifier;
export { default as createTablePlugin } from './createTablePlugin';
export const AddTable = props => (
  <AddTableComponent {...props} modifier={addTableModifier} />
);
