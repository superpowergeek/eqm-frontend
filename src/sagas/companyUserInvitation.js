import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import types from '@constants/actions';
import * as Selectors from 'selectors';
import { getCompanyUserInvitations, addCompanyUserInvitation, deleteCompanyUserInvitation } from './apis';

export function* watchGetCompanyUserInvitations() {
  yield takeEvery(types.GET_COMPANY_USER_INVITATIONS, function* foo(action) {
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const result = yield call(getCompanyUserInvitations, companyId);
      yield put({ type: types.GET_COMPANY_USER_INVITATIONS_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get company user invitations', e.response, e);
      yield put({ type: types.GET_COMPANY_USER_INVITATIONS_ERROR, error: e });
    }
  })
}

export function* watchAddCompanyUserInvitation() {
  yield takeEvery(types.ADD_COMPANY_USER_INVITATION, function* foo(action) {
    
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { email, role } = action.data;
      const { data: userInvitation } = yield call(addCompanyUserInvitation, { companyId, role, email });
      yield put({ type: types.ADD_COMPANY_USER_INVITATION_SUCCESS, data: { userInvitation, companyId }});
    } catch (e) {
      yield put({ type: types.ADD_COMPANY_USER_INVITATION_ERROR, error: e });
    }
  })
}

export function* watchDeleteCompanyUserInvitation() {
  yield takeEvery(types.DELETE_COMPANY_USER_INVITATION, function* foo(action) {
    try {
      const companyId = yield select(Selectors.selectUserCompanyId);
      const { itemIds } = action.data;
      yield all(itemIds.map(itemId => {
        return call(deleteCompanyUserInvitation, itemId);
      }));
      yield put({ type: types.DELETE_COMPANY_USER_INVITATION_SUCCESS, data: { companyId, itemIds } });
    } catch (e) {
      yield put({ type: types.DELETE_COMPANY_USER_INVITATION_ERROR, error: e });
    }
  })
}
export default function* companyUserInvitationRoot() {
  yield all([
    call(watchGetCompanyUserInvitations),
    call(watchAddCompanyUserInvitation),
    call(watchDeleteCompanyUserInvitation),
  ]);
}