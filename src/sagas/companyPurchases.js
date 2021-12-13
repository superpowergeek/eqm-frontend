import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';
import { CANCEL } from 'redux-saga';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyPurchasesApi, deleteCompanyPurchasesApi, addCompanyPurchasesApi, updateCompanyPurchasesApi } from './apis';

export function* watchGetCompanyPurchases() {
  yield takeEvery(types.GET_COMPANY_PURCHASES, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyPurchasesApi);
      yield put({ type: types.GET_COMPANY_PURCHASES_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company purchases items', e.response, e);
      yield put({ type: types.GET_COMPANY_PURCHASES_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyPurchases() {
  yield takeEvery(types.ADD_COMPANY_PURCHASES, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanyPurchasesApi, payload);
      yield put({ type: types.ADD_COMPANY_PURCHASES_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_PURCHASES_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyPurchases() {
  yield takeEvery(types.DELETE_COMPANY_PURCHASES, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId } = action.data;
      result = yield call(deleteCompanyPurchasesApi, recordId);
      yield put({ type: types.DELETE_COMPANY_PURCHASES_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_PURCHASES_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanyPurchases() {
  yield takeEvery(types.UPDATE_COMPANY_PURCHASES, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId, records } = action.data;
      result = yield call(updateCompanyPurchasesApi, recordId, records);
      yield put({ type: types.UPDATE_COMPANY_PURCHASES_SUCCESS, data: { data: result.data, companyId, recordId}})
    } catch (e) {
      yield put({type: types.UPDATE_COMPANY_PURCHASES_ERROR, error: e});
    } finally {
      if (yield cancelled()){
        //result[CANCEL]();
      }
    }
  })
}

export default function* companyPurchasesRoot() {
  yield all([
    call(watchGetCompanyPurchases),
    call(watchAddCompanyPurchases),
    call(watchDeleteCompanyPurchases),
    call(watchUpdateCompanyPurchases)
  ]);
}