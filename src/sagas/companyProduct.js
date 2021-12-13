import {all, call, put, select, takeEvery, cancelled} from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import {
  getCompanyProductApi,
  deleteCompanyProductApi,
  addCompanyProductApi,
  updateCompanyProductApi,
  addCompanyProductMaterialApi
} from './apis';

export function* watchGetCompanyProducts() {
  yield takeEvery(types.GET_COMPANY_PRODUCT, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyProductApi, companyId);
      yield put({type: types.GET_COMPANY_PRODUCT_SUCCESS, data: {collection: result.data, companyId}});
    } catch (e) {
      console.error('get company product', e.response, e);
      yield put({type: types.GET_COMPANY_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyProduct() {
  yield takeEvery(types.ADD_COMPANY_PRODUCT, function* foo(action) {
    let productResult;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const productPayload = action.data;
      let productMaterials = productPayload.productMaterials;

      productResult = yield call(addCompanyProductApi, productPayload);

      const productId = productResult.data.id;
      productMaterials = productMaterials.map(productMaterial => {
        return {...productMaterial, productId}
      });

      const productMaterialResults = yield all(productMaterials.map(productMaterial => {
        return call(addCompanyProductMaterialApi, productId, productMaterial);
      }))

      const record = {...productResult.data, productMaterials: productMaterialResults.map(result => result.data)};
      yield put({type: types.ADD_COMPANY_PRODUCT_SUCCESS, data: {record, companyId}});
    } catch (e) {
      yield put({type: types.ADD_COMPANY_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyProduct() {
  yield takeEvery(types.DELETE_COMPANY_PRODUCT, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const {recordId} = action.data;
      result = yield call(deleteCompanyProductApi, recordId);
      yield put({type: types.DELETE_COMPANY_PRODUCT_SUCCESS, data: {recordId, companyId}});
    } catch (e) {
      yield put({type: types.DELETE_COMPANY_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanyProductApi() {
  yield takeEvery(types.UPDATE_COMPANY_PRODUCT, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      const recordId = payload.id;
      result = yield call(updateCompanyProductApi, recordId, payload);
      yield put({type: types.UPDATE_COMPANY_PRODUCT_SUCCESS, data: {data: result.data, companyId, recordId}});
    } catch (e) {
      yield put({type: types.UPDATE_COMPANY_PRODUCT_ERROR, error: e});
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyProductRoot() {
  yield all([
    call(watchGetCompanyProducts),
    call(watchAddCompanyProduct),
    call(watchDeleteCompanyProduct),
    call(watchUpdateCompanyProductApi)
  ]);
}