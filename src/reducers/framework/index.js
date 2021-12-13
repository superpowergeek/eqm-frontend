import { combineReducers } from 'redux';

import collection from './collection';
import category from './category';

export default combineReducers({
  collection,
  category,
});