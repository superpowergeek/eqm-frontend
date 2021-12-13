import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import {
  deleteCompanyProductMaterialApi,
  addCompanyProductMaterialApi,
} from './apis';

export function* watchAddCompanyProductMaterial() {
  yield takeEvery(types.ADD_COMPANY_PRODUCT_MATERIAL, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      const { productId } = action.data;
      yield call(addCompanyProductMaterialApi, productId, payload);
      yield put({ type: types.GET_COMPANY_PRODUCT });
      yield put({ type: types.ADD_COMPANY_PRODUCT_MATERIAL_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_PRODUCT_MATERIAL_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyProductMaterial() {
  yield takeEvery(types.DELETE_COMPANY_PRODUCT_MATERIAL, function* foo(action) {
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { productId, recordId } = action.data;
      yield call(deleteCompanyProductMaterialApi, productId, recordId);
      yield put({ type: types.GET_COMPANY_PRODUCT });
      yield put({ type: types.DELETE_COMPANY_PRODUCT_MATERIAL_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_PRODUCT_MATERIAL_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyProductMaterialRoot() {
  yield all([
    call(watchAddCompanyProductMaterial),
    call(watchDeleteCompanyProductMaterial),
  ]);
}