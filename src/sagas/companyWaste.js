import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyWasteApi, deleteCompanyWasteApi, addCompanyWasteApi, updateCompanyWasteApi } from './apis';

export function* watchGetCompanyWastes() {
  yield takeEvery(types.GET_COMPANY_WASTE, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyWasteApi, companyId);
      yield put({ type: types.GET_COMPANY_WASTE_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company waste', e.response, e);
      yield put({ type: types.GET_COMPANY_WASTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyWaste() {
  yield takeEvery(types.ADD_COMPANY_WASTE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanyWasteApi, payload);
      yield put({ type: types.ADD_COMPANY_WASTE_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_WASTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyWaste() {
  yield takeEvery(types.DELETE_COMPANY_WASTE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId } = action.data;
      result = yield call(deleteCompanyWasteApi, recordId);
      yield put({ type: types.DELETE_COMPANY_WASTE_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_WASTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        // result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanyWaste() {
  yield takeEvery(types.UPDATE_COMPANY_WASTE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId, records } = action.data;
      result = yield call(updateCompanyWasteApi, recordId, records );
      yield put({ type: types.UPDATE_COMPANY_WASTE_SUCCESS, data: { data: result.data, companyId, recordId }});
    } catch (e) {
      yield put({ type: types.UPDATE_COMPANY_WASTE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyWasteRoot() {
  yield all([
    call(watchGetCompanyWastes),
    call(watchAddCompanyWaste),
    call(watchDeleteCompanyWaste),
    call(watchUpdateCompanyWaste)
  ]);
}