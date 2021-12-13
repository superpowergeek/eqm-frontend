import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyTravelApi, deleteCompanyTravelApi, addCompanyTravelApi } from './apis';

export function* watchGetCompanyTravels() {
  yield takeEvery(types.GET_COMPANY_TRAVEL, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyTravelApi);
      yield put({ type: types.GET_COMPANY_TRAVEL_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company travel', e.response, e);
      yield put({ type: types.GET_COMPANY_TRAVEL_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyTravel() {
  yield takeEvery(types.ADD_COMPANY_TRAVEL, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanyTravelApi, payload);
      yield put({ type: types.ADD_COMPANY_TRAVEL_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_TRAVEL_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyTravel() {
  yield takeEvery(types.DELETE_COMPANY_TRAVEL, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId } = action.data;
      result = yield call(deleteCompanyTravelApi, recordId);
      yield put({ type: types.DELETE_COMPANY_TRAVEL_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_TRAVEL_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyTravelRoot() {
  yield all([
    call(watchGetCompanyTravels),
    call(watchAddCompanyTravel),
    call(watchDeleteCompanyTravel)
  ]);
}