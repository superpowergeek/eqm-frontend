import { combineReducers } from 'redux';

import assetGroups from './assetGroups';
import assets from './assets';
import assetEngine from './assetEngine';
import assetRefrigerator from './assetRefrigerator';
import assetFuelConsumption from './assetFuelConsumption';
import assetRefrigeratorConsumption from './assetRefrigeratorConsumption';
import assetWaste from './assetWaste';
import assetUtility from './assetUtility';
import assigns from './assigns';
import assignedFrom from './assignedFrom';
import assignedTo from './assignedTo';

export default combineReducers({
  assets,
  assetGroups,
  assetFuelConsumption,
  assetWaste,
  assetEngine,
  assetRefrigerator,
  assetUtility,
  assetRefrigeratorConsumption,
  assigns,
  assignedTo,
  assignedFrom,
})