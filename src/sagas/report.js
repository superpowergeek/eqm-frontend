import { all, call, put, takeEvery, select, takeLatest } from 'redux-saga/effects';
import { convertToRaw } from 'draft-js';
import types from '@constants/actions';
import * as Selectors from 'selectors';
import {
  addUserReport,
  updateUserReport,
  getUserReports,
  deleteUserReport,
  getUserReport,
} from './apis';

export function* watchUpdateUserReport() {
  yield takeLatest(types.UPDATE_USER_REPORT, function* (action) {
    try {
      const currentReport = yield select(Selectors.selectReportCurrentReport);
      const { id, name, description, content } = currentReport;
      const rawContent = convertToRaw(content.getCurrentContent());
      const stringContent = JSON.stringify(rawContent);
      const result = yield call(updateUserReport, id, { name, description, content: stringContent });
      yield put({ type: types.UPDATE_USER_REPORT_SUCCESS, data: { report: result.data }});
    } catch (e) {
      yield put({ type: types.UPDATE_USER_REPORT_ERROR, error: e });
    }
  })
}
export function* watchDeleteUserReports() {
  yield takeEvery(types.DELETE_USER_REPORT, function* (action) {
    try {
      const { itemIds } = action.data;
      yield all(
        itemIds.map(id => call(deleteUserReport, id))
      )
      yield put({ type: types.DELETE_USER_REPORT_SUCCESS, data: { itemIds } });
    } catch (e) {
      yield put({ type: types.DELETE_USER_REPORT_ERROR, error: e });
    }
  })
} 

export function* watchAddUserReport() {
  yield takeLatest(types.ADD_USER_REPORT, function* foo(action) {
    try {
      const { name, description, content } = action.data;
      const result = yield call(addUserReport, { name, description, content });
      yield put({ type: types.ADD_USER_REPORT_SUCCESS, data: { report: result.data }});
    } catch (e) {
      console.log('Error When Add User Report', e);
      yield put({ type: types.ADD_USER_REPORT_ERROR, error: e });
    }
    
  });
}

export function* watchGetUserReports() {
  yield takeEvery(types.GET_USER_REPORTS, function* foo(action) {
    try {
      const userId = yield select(Selectors.selectUserId);
      const result = yield call(getUserReports, userId);
      console.log('success');
      yield put({ type: types.GET_USER_REPORTS_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      console.log('error', e);
      yield put({ type: types.GET_USER_REPORTS_ERROR, error: e });
    }
  });
}

export function* watchGetReportContent() {
  yield takeEvery(types.GET_SINGLE_USER_REPORT, function* foo(action) {
    try {
      const { id } = action.data;
      const result = yield call(getUserReport, id);
      yield put({ type: types.GET_SINGLE_USER_REPORT_SUCCESS, data: { report: result.data }});

    } catch (e) {
      yield put({ type: types.GET_SINGLE_USER_REPORT_ERROR, error: e });
    }
  })
}

export default function* reportRoot() {
  yield all([
    call(watchGetUserReports),
    call(watchAddUserReport),
    call(watchDeleteUserReports),
    call(watchUpdateUserReport),
    call(watchGetReportContent),
  ]);
}