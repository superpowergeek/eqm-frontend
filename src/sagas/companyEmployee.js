import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyEmployeeApi, deleteCompanyEmployeeApi, addCompanyEmployeeApi, updateCompanyEmployeeApi } from './apis';

export function* watchGetCompanyEmployees() {
  yield takeEvery(types.GET_COMPANY_EMPLOYEE, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyEmployeeApi);
      yield put({ type: types.GET_COMPANY_EMPLOYEE_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company employee', e.response, e);
      yield put({ type: types.GET_COMPANY_EMPLOYEE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddCompanyEmployee() {
  yield takeEvery(types.ADD_COMPANY_EMPLOYEE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const payload = action.data;
      result = yield call(addCompanyEmployeeApi, payload);
      yield put({ type: types.ADD_COMPANY_EMPLOYEE_SUCCESS, data: { record: result.data, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_EMPLOYEE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteCompanyEmployee() {
  yield takeEvery(types.DELETE_COMPANY_EMPLOYEE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId } = action.data;
      result = yield call(deleteCompanyEmployeeApi, recordId);
      yield put({ type: types.DELETE_COMPANY_EMPLOYEE_SUCCESS, data: { recordId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_EMPLOYEE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateCompanyEmployee() {
  yield takeEvery(types.UPDATE_COMPANY_EMPLOYEE, function* foo(action) {
    let result;
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { recordId, records } = action.data;
      result = yield call(updateCompanyEmployeeApi, recordId, records );
      yield put({ type: types.UPDATE_COMPANY_EMPLOYEE_SUCCESS, data: { data: result.data, companyId, recordId }});
    } catch (e) {
      yield put({ type: types.UPDATE_COMPANY_EMPLOYEE_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* companyEmployeeRoot() {
  yield all([
    call(watchGetCompanyEmployees),
    call(watchAddCompanyEmployee),
    call(watchDeleteCompanyEmployee),
    call(watchUpdateCompanyEmployee)
  ]);
}