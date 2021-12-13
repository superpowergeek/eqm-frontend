import { combineReducers } from 'redux';
import summary from './summary';
import company from './company';
import companyTravel from './companyTravel';
import companyPurchases from './companyPurchases';
import companyCommute from './companyCommute';
import companyProduct from './companyProduct';
import companySoldProduct from './companySoldProduct';
import companyProductMaterial from './companyProductMaterial';
import companyUserInvitation from './companyUserInvitation';
import material from './material';
import companyUtility from './companyUtility';
import companyWaste from './companyWaste';
import companyEmployee from './companyEmployee';
import companyMetric from './companyMetric';
import companyUser from './companyUser';
import spendCost from './spendCost';
import emission from './emission';
import childrenCompany from './childrenCompany';
import parentsCompany from './parentsCompany';
import engine from './engine';
import fuel from './fuel';
import analytic from './analytic';
import report from './report';

export default combineReducers({
  company,
  companyTravel,
  companyPurchases,
  companyCommute,
  companyProduct,
  companySoldProduct,
  companyProductMaterial,
  companyUtility,
  companyWaste,
  companyEmployee,
  companyMetric,
  companyUser,
  companyUserInvitation,
  material,
  spendCost,
  emission,
  childrenCompany,
  parentsCompany,
  report,
  summary,
  engine,
  fuel,
  analytic,
  // rest of reducers
});