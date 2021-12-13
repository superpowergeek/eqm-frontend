import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyUtilityApi, deleteCompanyUtilityApi, addCompanyUtilityApi, updateCompanyUtilityApi } from './apis';

export function* watchGetCompanyUtilities() {
  yield takeEvery(types.GET_COMPANY_UTILITY, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyUtilityApi, companyId);
      yield put({ type: types.GET_COMPANY_UTILITY_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company utility', e.response, e);
      yield put({ type: types.GET_COMPANY_UTILITY_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyUtility() {
  yield takeEvery(types.ADD_COMPANY_UTILITY, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanyUtilityApi, payload);
      yield put({ type: types.ADD_COMPANY_UTILITY_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_UTILITY_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyUtility() {
  yield takeEvery(types.DELETE_COMPANY_UTILITY, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId } = action.data;
      result = yield call(deleteCompanyUtilityApi, recordId);
      yield put({ type: types.DELETE_COMPANY_UTILITY_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_UTILITY_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanyUtility() {
  yield takeEvery(types.UPDATE_COMPANY_UTILITY, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId, records } = action.data;
      result = yield call(updateCompanyUtilityApi, recordId, records );
      yield put({ type: types.UPDATE_COMPANY_UTILITY_SUCCESS, data: { data: result.data, companyId, recordId }});
    } catch (e) {
      yield put({ type: types.UPDATE_COMPANY_UTILITY_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyUtilityRoot() {
  yield all([
    call(watchGetCompanyUtilities),
    call(watchAddCompanyUtility),
    call(watchDeleteCompanyUtility),
    call(watchUpdateCompanyUtility)
  ]);
}