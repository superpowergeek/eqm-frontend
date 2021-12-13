import { createSelector } from 'reselect';
import { categories, pollutantItems } from '@constants';
import types from '@constants/actions';

// state
const selectRouter = state => state.router;
const selectError = state => state.error;

// state.app
const selectSession = state => state.app.session;
const selectPersistence = state => state.app.persistance;


// state.framework
const selectFrameworks = state => state.framework.collection;
const selectFrameworkCategory = state => state.framework.category; // [companyId][frameworkId]

// state.main
const selectEngines = state => state.main.engine;
const selectTags = state => state.main.tags;
const selectFuels = state => state.main.fuel;
const selectCompany = state => state.main.company;
const selectParentsCompany = state => state.main.parentsCompany;
const selectSummary = state => state.main.summary;
const selectTravels = state => state.main.companyTravel;
const selectCommutes = state => state.main.companyCommute;
const selectProducts = state => state.main.companyProduct;
const selectSoldProducts = state => state.main.companySoldProduct;
const selectProductMaterials = state => state.main.companyProductMaterial;
const selectMaterials = state => state.main.material;
const selectUtility = state => state.main.companyUtility;
const selectCompanyWaste = state => state.main.companyWaste;
const selectPurchases = state => state.main.companyPurchases;
const selectEmployee = state => state.main.companyEmployee;
const selectSpendCost = state => state.main.spendCost;
const selectEmission = state => state.main.emission;
const selectMetric = state => state.main.companyMetric;
const selectCompanyUser = state => state.main.companyUser;
const selectCompanyInvitation = state => state.main.companyUserInvitation;

// state.main.report
const selectReport = state => state.main.report;

const selectReportRecord = createSelector(
  selectReport,
  report => report.reportRecord,
)

const selectReportCurrentReport = createSelector(
  selectReport,
  report => report.currentReport,
)

const selectReportCurrentReportEditState = createSelector(
  selectReportCurrentReport,
  currentReport => currentReport.content,
)

const selectReportRecordIds = createSelector(
  selectReportRecord,
  reportRecord => reportRecord.ids,
)

const selectReportRecordIdMap = createSelector(
  selectReportRecord,
  reportRecord => reportRecord.idMap,
)

// state.main.analytic
const selectAnalytic = state => state.main.analytic;
const selectAnalyticData = createSelector(
  selectAnalytic,
  analytic => analytic.analyticData,
)

const selectAnalyticReport = createSelector(
  selectAnalytic,
  analytic => analytic.analyticReport,
)

const selectAnalyticReportIds = createSelector(
  selectAnalyticReport,
  analyticReport => analyticReport.ids,
)

const selectAnalyticReportIdMap = createSelector(
  selectAnalyticReport,
  analyticReport => analyticReport.idMap,
)

const selectAnalyticCurrentConfig = createSelector(
  selectAnalytic,
  analytic => analytic.currentChartConfig,
)

const selectAnalyticCurrentReportId = createSelector(
  selectAnalyticCurrentConfig,
  config => config && config.id,
)

const selectAnalyticCurrentChartType = createSelector(
  selectAnalyticCurrentConfig,
  config => config && config.chartType,
)

const selectAnalyticCurrentDataObject = createSelector(
  selectAnalyticData,
  selectAnalyticCurrentReportId,
  (dataById, currentId) => {
    if (!dataById[currentId]) return {};
    return dataById[currentId];
  }
)
// state.global
const selectAssetGroups = state => state.global.assetGroups;
const selectAssets = state => state.global.assets;
const selectAssetWaste = state => state.global.assetWaste;
const selectAssetFuelConsumption = state => state.global.assetFuelConsumption;
const selectAssetRefrigeratorConsumption = state => state.global.assetRefrigeratorConsumption;
const selectAssetUtility = state => state.global.assetUtility;
const selectAssigns = state => state.global.assigns;
const selectAssignedFrom = state => state.global.assignedFrom;
const selectAssignedTo = state => state.global.assignedTo;
const selectAssetEngines = state => state.global.assetEngine;
const selectAssetRefrigerators = state => state.global.assetRefrigerator;

const selectAssetTypeWithParams = (id, type) => state => {
  const assetTypeDetailById = state.global[`asset${type}`];
  if (!assetTypeDetailById) return {};
  if (!assetTypeDetailById[id]) return {};
  return assetTypeDetailById[id];
};

const selectPollutantSources = createSelector(
  selectSummary,
  summary => summary && summary[categories.POLLUTANTS] && summary[categories.POLLUTANTS].sources,
)
const selectPollutantTotal = createSelector(
  selectSummary,
  summary => summary && summary[categories.POLLUTANTS] && summary[categories.POLLUTANTS].total,
)
const selectTotalCOx = createSelector(
  selectPollutantTotal,
  total => total && total[pollutantItems.COX],
)

const selectTotalSOx = createSelector(
  selectPollutantTotal,
  total => total && total[pollutantItems.SOX],
)

const selectTotalPM2_5 = createSelector(
  selectPollutantTotal,
  total => total && total[pollutantItems.PM2_5],
)

const selectTotalNOx = createSelector(
  selectPollutantTotal,
  total => total && total[pollutantItems.NOX],
)

const selectTotalPM10 = createSelector(
  selectPollutantTotal,
  total => total && total[pollutantItems.PM10],
)

const selectCompanyIds = createSelector(
  selectCompany,
  company => (company && company.ids),
);

const selectCompanyIdMap = createSelector(
  selectCompany,
  company => (company && company.idMap),
);

const selectCompanyNameMap = createSelector(
  selectCompanyIdMap,
  idMap => {
    if (!idMap) return undefined;
    const nameMap = {};
    Object.entries(idMap).forEach(([id, name]) => {
      nameMap[name] = id;
    })
    return nameMap;
  }
)
const selectPollutants = createSelector(
  selectReport,
  report => (report && report[categories.POLLUTANTS]) || {},
)

const selectWaste = createSelector(
  selectReport,
  report => (report && report[categories.WASTE]) || {},
)

// const selectUtilities 

const selectAuthError = createSelector(
  selectError,
  err => err && err[types.AUTH_USER_ERROR],
)

const selectRegistError = createSelector(
  selectError,
  err => err && err[types.REGIST_USER_ERROR],
)

const selectPostCompanyError = createSelector(
  selectError,
  err => err && err[types.POST_COMPANY_ERROR],
)

const selectLocation = createSelector(
  selectRouter,
  router => router && router.location,
)

const selectPathName = createSelector(
  selectLocation,
  location => location && location.pathname,
)

const selectUser = createSelector(
  selectSession,
  session => session && session.user,
)

const selectUserDashboard = createSelector(
  selectUser,
  user => user.dashboard || [],
)

const selectUserCompanyId = createSelector(
  selectUser,
  user => user && user.companyId,
)

const selectUserName = createSelector(
  selectUser,
  user => user && user.username,
)

const selectUserId = createSelector(
  selectUser,
  user => user && user.id,
)

const selectRememberMe = createSelector(
  selectPersistence,
  persist => persist && !!persist.rememberMe,
)
const selectUserIsAuthenticated = createSelector(
  selectSession,
  session => !!session,
)

const selectCurrentParentsCompany = createSelector(
  selectUserCompanyId,
  selectParentsCompany,
  (id, companyById) => companyById && companyById[id],
)

const selectSDGFrameworkCategories = createSelector(
  selectUserCompanyId,
  selectFrameworks,
  selectFrameworkCategory,
  (companyId, frameworks, frameworkCategories) => {
    const SDGId = frameworks[0]?.id;
    return frameworkCategories[companyId]?.[SDGId]
  },
)

export {
  selectUserIsAuthenticated,
  selectUser,
  selectUserId,
  selectUserCompanyId,
  selectUserName,
  selectUserDashboard,
  selectParentsCompany,
  selectAssignedFrom,
  selectAssignedTo,
  selectEngines,
  selectTags,
  selectFuels,
  selectSpendCost,
  selectEmission,
  selectAssetEngines,
  selectAssetRefrigerators,

  selectTotalSOx,
  selectTotalCOx,
  selectTotalPM2_5,
  selectTotalNOx,
  selectTotalPM10,

  selectPollutantSources,

  selectPersistence,
  selectSession,
  selectRememberMe,
  selectRegistError,
  selectPostCompanyError,
  selectPathName,
  selectAuthError,
  selectPollutants,
  selectWaste,
  selectReport,
  selectCompanyIdMap,
  selectCompanyIds,
  selectCompanyNameMap,

  selectCurrentParentsCompany,
  selectAssets,
  selectAssetGroups,
  selectAssetWaste,
  selectAssetFuelConsumption,
  selectAssetRefrigeratorConsumption,
  selectAssetUtility,
  selectAssigns,

  selectTravels,
  selectCommutes,
  selectProducts,
  selectSoldProducts,
  selectProductMaterials,
  selectMaterials,
  selectPurchases,
  selectUtility,
  selectCompanyWaste,
  selectEmployee,
  selectMetric,
  selectCompanyUser,
  selectCompanyInvitation,
  selectAnalytic,
  selectAnalyticData,
  selectAnalyticCurrentConfig,
  selectAnalyticCurrentReportId,
  selectAnalyticCurrentChartType,
  selectAnalyticCurrentDataObject,

  selectReportRecordIds,
  selectReportRecordIdMap,
  selectReportCurrentReport,
  selectReportCurrentReportEditState,

  selectAnalyticReport,
  selectAnalyticReportIds,
  selectAnalyticReportIdMap,
  // params
  selectAssetTypeWithParams,


  selectFrameworks,
  selectFrameworkCategory,
  selectSDGFrameworkCategories,
}
