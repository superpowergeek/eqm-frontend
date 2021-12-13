
import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyUsers } from './apis';

export function* watchGetCompanyUsers() {
  yield takeEvery(types.GET_COMPANY_USERS, function* foo(action) {
    let result;
    const companyId = yield select(Selectors.selectUserCompanyId);
    try {
      result = yield call(getCompanyUsers, companyId);
      yield put({ type: types.GET_COMPANY_USERS_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company users', e.response, e);
      yield put({ type: types.GET_COMPANY_USERS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* companyUserRoot() {
  yield all([
    call(watchGetCompanyUsers),
  ])
}
