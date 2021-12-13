import {all, call, put, select, takeEvery, cancelled} from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import {
  getCompanySoldProductApi,
  addCompanySoldProductApi,
  deleteCompanySoldProductApi,
  updateCompanySoldProductApi
} from './apis';

export function* watchGetCompanySoldProducts() {
  yield takeEvery(types.GET_COMPANY_SOLD_PRODUCT, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanySoldProductApi, companyId);
      yield put({type: types.GET_COMPANY_SOLD_PRODUCT_SUCCESS, data: {collection: result.data, companyId}});
    } catch (e) {
      console.error('get company product', e.response, e);
      yield put({type: types.GET_COMPANY_SOLD_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanySoldProduct() {
  yield takeEvery(types.ADD_COMPANY_SOLD_PRODUCT, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanySoldProductApi, payload);
      yield put({ type: types.ADD_COMPANY_SOLD_PRODUCT_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({type: types.ADD_COMPANY_SOLD_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanySoldProduct() {
  yield takeEvery(types.DELETE_COMPANY_SOLD_PRODUCT, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const {recordId} = action.data;
      result = yield call(deleteCompanySoldProductApi, recordId);
      yield put({type: types.DELETE_COMPANY_SOLD_PRODUCT_SUCCESS, data: {recordId, companyId}});
    } catch (e) {
      yield put({type: types.DELETE_COMPANY_SOLD_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanySoldProductApi() {
  yield takeEvery(types.UPDATE_COMPANY_SOLD_PRODUCT, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { id, payload } = action.data;

      result = yield call(updateCompanySoldProductApi, id, payload);
      yield put({type: types.UPDATE_COMPANY_SOLD_PRODUCT_SUCCESS, data: {data: result.data, companyId, recordId: id}});
    } catch (e) {
      yield put({type: types.UPDATE_COMPANY_SOLD_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyProductRoot() {
  yield all([
    call(watchGetCompanySoldProducts),
    call(watchAddCompanySoldProduct),
    call(watchDeleteCompanySoldProduct),
    call(watchUpdateCompanySoldProductApi)
  ]);
}