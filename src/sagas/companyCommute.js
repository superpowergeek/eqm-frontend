import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyCommuteApi, deleteCompanyCommuteApi, addCompanyCommuteApi, updateCompanyCommuteApi } from './apis';

export function* watchGetCompanyCommutes() {
  yield takeEvery(types.GET_COMPANY_COMMUTE, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyCommuteApi, companyId);
      yield put({ type: types.GET_COMPANY_COMMUTE_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company commute', e.response, e);
      yield put({ type: types.GET_COMPANY_COMMUTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyCommute() {
  yield takeEvery(types.ADD_COMPANY_COMMUTE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanyCommuteApi, payload);
      yield put({ type: types.ADD_COMPANY_COMMUTE_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_COMMUTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyCommute() {
  yield takeEvery(types.DELETE_COMPANY_COMMUTE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId } = action.data;
      result = yield call(deleteCompanyCommuteApi, recordId);
      yield put({ type: types.DELETE_COMPANY_COMMUTE_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_COMMUTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanyCommuteApi() {
  yield takeEvery(types.UPDATE_COMPANY_COMMUTE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId, records } = action.data;
      result = yield call(updateCompanyCommuteApi, recordId, records );
      yield put({ type: types.UPDATE_COMPANY_COMMUTE_SUCCESS, data: { data: result.data, companyId, recordId }});
    } catch (e) {
      yield put({ type: types.UPDATE_COMPANY_COMMUTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyCommuteRoot() {
  yield all([
    call(watchGetCompanyCommutes),
    call(watchAddCompanyCommute),
    call(watchDeleteCompanyCommute),
    call(watchUpdateCompanyCommuteApi)
  ]);
}