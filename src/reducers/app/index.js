import { combineReducers } from 'redux';

import persistence from './persistence';
import session from './session';

export default combineReducers({
  persistence,
  session,
})