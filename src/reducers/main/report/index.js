import { combineReducers } from 'redux';
import reportRecord from './reportRecord';
import currentReport from './currentReport';

export default combineReducers({
  reportRecord,
  currentReport,
});