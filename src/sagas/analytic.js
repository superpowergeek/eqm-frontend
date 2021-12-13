import { WAIT_FOR_ACTION, ERROR_ACTION } from 'redux-wait-for-action';
import { all, call, put, takeEvery, fork, join, select } from 'redux-saga/effects';
import types from '@constants/actions';
import merge from 'lodash/merge';
import { categories, wasteTypeMap, sourceCategory } from '@constants';
import { wastePreprocesser} from 'utils/dataParser';
import * as Selectors from 'selectors';
import { 
  getReportsApi,
  getReportsByGroupIds,
  getReportsByAssetIds,
  deleteAnalyticReport,
  addAnalyticReport,
  getUserAnalyticReports,
  updateUserAnalyticReport,
} from './apis';

export function* getMutiWastesResults(payload) {
  const { wasteTypes, ids, assets, assetGroups, ...others } = payload;
  try {
    if (assets) {
      const result = yield all(
        wasteTypes.map(wasteName => {
          const wasteType = wasteTypeMap[wasteName];
          return call(getReportsByAssetIds, { wasteType, assets, ids, ...others });
        })
      )
      return {
        data: wastePreprocesser(result, wasteTypes, assets),
      }
    }
    if (assetGroups) {
      const result = yield all(
        wasteTypes.map(wasteName => {
          const wasteType = wasteTypeMap[wasteName];
          return call(getReportsByGroupIds, { wasteType, assetGroups, ids, ...others });
        })
      )
      return {
        data: wastePreprocesser(result, wasteTypes, assetGroups),
      }
    }
    const result = yield all(
      wasteTypes.map(wasteName => {
        const wasteType = wasteTypeMap[wasteName];
        return call(getReportsApi, { wasteType, ids, ...others });
      })
    )
    return {
      data: wastePreprocesser(result, wasteTypes, ids),
    };
  } catch (e) {
    console.warn('Get Waste Error', e);
  }

}

export function* watchUpdateAnalyticReport() {
  yield takeEvery(types.UPDATE_ANALYTIC_REPORT, function* (action) {
    try {
      const { id, payload } = action.data;
      const result = yield call(updateUserAnalyticReport, id, payload);
      yield put({ type: types.UPDATE_ANALYTIC_REPORT_SUCCESS, data: { report: result.data }});
    } catch (e) {
      yield put({ type: types.UPDATE_ANALYTIC_REPORT_ERROR, error: e });
    }
  })
}

export function* watchAddAnalyticReportSuccess() {
  yield takeEvery(types.ADD_ANALYTIC_REPORT_SUCCESS, function* (action) {
    try {
      const { report } = action.data;
      const dashboard = yield select(Selectors.selectUserDashboard);
      const userId = yield select(Selectors.selectUserId);
      const newDashboard = [ ...dashboard, { reportId: report.id }];
      yield put({
        type: types.UPDATE_USER,
        data: {
          value: JSON.stringify(newDashboard),
          field: 'dashboard',
          id: userId,
        },
      })
    } catch (e) {

    }
  })
}

export function* watchDeleteAnalyticReportSuccess() {
  yield takeEvery(types.DELETE_ANALYTIC_REPORT_SUCCESS, function* (action) {
    try {
      const { itemIds } = action.data;
      const dashboard = yield select(Selectors.selectUserDashboard);
      const userId = yield select(Selectors.selectUserId);
      const newDashboard = [ ...dashboard.filter(row => itemIds.indexOf(row.reportId) === -1)];
      yield put({
        type: types.UPDATE_USER,
        data: {
          value: JSON.stringify(newDashboard),
          field: 'dashboard',
          id: userId,
        },
      })
    } catch (e) {

    }
  })
}
export function* watchUpdateAnalytciReportConfigs() {
  yield takeEvery(types.UPDATE_ANALYTIC_REPORT_CONFIGS, function* (action) {
    try {
      const { itemIds, dataMap } = action.data;
      yield all(
        itemIds.map(id => {
          const { config, name } = dataMap[id];
          const content = JSON.stringify(config);
          return put({
            type: types.UPDATE_ANALYTIC_REPORT,
            [WAIT_FOR_ACTION]: types.UPDATE_ANALYTIC_REPORT_SUCCESS,
            [ERROR_ACTION]: types.UPDATE_ANALYTIC_REPORT_ERROR,
            data: {
              id,
              payload: {
                name,
                content,
              }
            }
          });
        })
      )
      yield put({ type: types.UPDATE_ANALYTIC_REPORT_CONFIGS_SUCCESS });
    } catch (e) {
      yield put({ type: types.UPDATE_ANALYTIC_REPORT_CONFIGS_ERROR, error: e });
    }
  })
}

export function* watchDeleteAnalyticReports() {
  yield takeEvery(types.DELETE_ANALYTIC_REPORT, function* (action) {
    try {
      const { itemIds } = action.data;
      yield all(
        itemIds.map(id => call(deleteAnalyticReport, id))
      )
      yield put({ type: types.DELETE_ANALYTIC_REPORT_SUCCESS, data: { itemIds } });
    } catch (e) {
      yield put({ type: types.DELETE_ANALYTIC_REPORT_ERROR, error: e });
    }
  })
} 

export function* watchGetAllAnalyticReportsSuccess() {
  yield takeEvery(types.GET_ANALYTIC_REPORTS_SUCCESS, function* (action) {
    const { collection } = action.data;
    try {
      yield all(collection.map((analyticReport) => {
        const { id, config } = analyticReport; // Reconstruct by reducer JSON.parse
        const { source } = config;
        return put({ type: types.GET_ANALYTIC_DATA, data: { id, sourceConfig: source }});
      }))
    } catch (e) {
      console.warn('Get Analytic Data Process Error', e);
    }
  })
}

export function* watchAddAnalyticReport() {
  yield takeEvery(types.ADD_ANALYTIC_REPORT, function* foo(action) {
    try {
      const { name, description, config } = action.data;
      const content = JSON.stringify(config);
      const result = yield call(addAnalyticReport, { name, description, content });
      yield put({ type: types.ADD_ANALYTIC_REPORT_SUCCESS, data: { report: result.data }});
    } catch (e) {
      console.log('Error When Add Analytic', e);
      yield put({ type: types.ADD_ANALYTIC_REPORT_ERROR, error: e });
    }
    
  });
}

export function* watchAddTmpReport() {
  yield takeEvery(types.ADD_TMP_ANALYTIC_REPORT, function* foo(action) {
    try {
      const { id, config } = action.data;
      const { source } = config;

      yield put({ type: types.GET_ANALYTIC_DATA, data: { id, sourceConfig: source }})
    } catch {

    }

  })
}

export function* watchGetAllAnalyticReports() {
  yield takeEvery(types.GET_ANALYTIC_REPORTS, function* foo(action) {
    try {
      const { userId } = action.data;
      const result = yield call(getUserAnalyticReports, userId);
      yield put({ type: types.GET_ANALYTIC_REPORTS_SUCCESS, data: { collection: result.data }});
    } catch (e) {

    }
  });
}

export function* watchGetAnalyticData() {
  yield takeEvery(types.GET_ANALYTIC_DATA, function* foo(action) {
    try {
      const { id, sourceConfig } = action.data;
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { categoryMap, sourceCategoryMap, frequency, range } = sourceConfig;
      const companyIds = sourceCategoryMap[sourceCategory.COMPANY] && sourceCategoryMap[sourceCategory.COMPANY].map(row => row.id);
      const assetGroups = sourceCategoryMap[sourceCategory.ASSETGROUP] && sourceCategoryMap[sourceCategory.ASSETGROUP].map(row => row.id);
      const assets = sourceCategoryMap[sourceCategory.ASSET] && sourceCategoryMap[sourceCategory.ASSET].map(row => row.id);
      const tasks = [];
      const groupTasks = [];
      const assetTasks = [];
      const pollutants = categoryMap[categories.POLLUTANTS];
      if (pollutants.length > 0) {
        if (companyIds.length > 0) {
          const task = yield fork(getReportsApi, { ids: companyIds, category: categories.POLLUTANTS, frequency, range });
          tasks.push(task);
        }
        if (assetGroups.length > 0) {
          const groupTask = yield fork(getReportsByGroupIds, { ids: [companyId], category: categories.POLLUTANTS, frequency, range, assetGroups });
          groupTasks.push(groupTask);
        }
        if (assets.length > 0) {
          const assetTask = yield fork(getReportsByAssetIds, { ids: [companyId], category: categories.POLLUTANTS, frequency, range, assets });
          assetTasks.push(assetTask);
        }
      }
      
      const wasteTypes = categoryMap[categories.WASTE];
      if (wasteTypes.length > 0) {
        if (companyIds.length > 0) {
          const task = yield fork(getMutiWastesResults, { ids: companyIds, category: categories.WASTE, frequency, range, wasteTypes });
          tasks.push(task);
        }
        if (assetGroups.length > 0) {
          const groupTask = yield fork(getMutiWastesResults, { ids: [companyId], category: categories.WASTE, frequency, range, assetGroups, wasteTypes });
          groupTasks.push(groupTask);
        }
        if (assets.length > 0) {
          const assetTask = yield fork(getMutiWastesResults, { ids: [companyId], category: categories.WASTE, frequency, range, assets, wasteTypes });
          assetTasks.push(assetTask);
        }
      }
      const assetRes = yield join(assetTasks);
      const assetMergeResult = merge(...assetRes.map(({ data }) => data));
      const groupRes = yield join(groupTasks);
      const groupMergeResult = merge(...groupRes.map(({ data }) => data));
      const res = yield join(tasks);
      const mergeResult = merge(...res.map(({ data }) => data));
      yield put({ type: types.GET_ANALYTIC_DATA_SUCCESS, data: { 
        id,
        result: {
          [sourceCategory.COMPANY]: mergeResult,
          [sourceCategory.ASSETGROUP]: groupMergeResult,
          [sourceCategory.ASSET]: assetMergeResult,
        },
      } });
    } catch (e) {
      yield put({ type: types.GET_ANALYTIC_DATA_ERROR, error: e });
      console.log('e', e);
    }
  });
}

export default function* analyticRoot() {
  yield all([
    call(watchGetAnalyticData),
    call(watchAddTmpReport),
    call(watchAddAnalyticReport),
    call(watchGetAllAnalyticReports),
    call(watchGetAllAnalyticReportsSuccess),
    call(watchDeleteAnalyticReports),
    call(watchUpdateAnalytciReportConfigs),
    call(watchUpdateAnalyticReport),
    call(watchAddAnalyticReportSuccess),
    call(watchDeleteAnalyticReportSuccess),
  ]);
}