import { combineReducers } from 'redux';
import analyticData from './analyticData';
import analyticReport from './analyticReport';
import currentChartConfig from './currentChartConfig';

export default combineReducers({
  analyticData,
  analyticReport,
  currentChartConfig,
});