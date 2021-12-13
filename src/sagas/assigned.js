import { all, call, put, takeLatest, delay, takeEvery, cancelled } from 'redux-saga/effects';
import { assignableTypes } from '@constants';
import types from '@constants/actions';
import { getAllAssignedFromRecords, getAllAssignedToRecords } from './apis';

export function* watchGetAllAssignedTo() {
  yield takeLatest(types.GET_ALL_ASSIGNED_TO, function* foo(action) {
    try {
      const { companyId } = action.data;
      yield put({ type: types.GET_ASSIGNED_TO_RECORDS, data: { companyId, type: assignableTypes.FUEL_CONSUMPTION }});
      yield delay(300);
      yield put({ type: types.GET_ASSIGNED_TO_RECORDS, data: { companyId, type: assignableTypes.WASTE }});
      yield delay(300);
      yield put({ type: types.GET_ASSIGNED_TO_RECORDS, data: { companyId, type: assignableTypes.TRAVEL }});
      yield delay(300);
      yield put({ type: types.GET_ASSIGNED_TO_RECORDS, data: { companyId, type: assignableTypes.UTILITY }});
    } catch (e) {

    }
  })
}

export function* watchGetAllAssignedFrom() {
  yield takeLatest(types.GET_ALL_ASSIGNED_FROM, function* foo(action) {
    try {
      const { companyId } = action.data;
      yield put({ type: types.GET_ASSIGNED_FROM_RECORDS, data: { companyId, type: assignableTypes.FUEL_CONSUMPTION }});
      yield delay(300);
      yield put({ type: types.GET_ASSIGNED_FROM_RECORDS, data: { companyId, type: assignableTypes.WASTE }});
      yield delay(300);
      yield put({ type: types.GET_ASSIGNED_FROM_RECORDS, data: { companyId, type: assignableTypes.TRAVEL }});
      yield delay(300);
      yield put({ type: types.GET_ASSIGNED_FROM_RECORDS, data: { companyId, type: assignableTypes.UTILITY }});
    } catch (e) {

    }
  })
}

export function* watchGetAssignedTo() {
  yield takeEvery(types.GET_ASSIGNED_TO_RECORDS, function* foo(action) {
    let result;
    try {
      const { companyId, type } = action.data;  
      result = yield call(getAllAssignedToRecords, companyId, type);
      yield put({ type: types.GET_ASSIGNED_TO_RECORDS_SUCCESS, data: { collection: result.data, type, companyId } });
    } catch (e) {
      // console.log('assigned to error',e);
      yield put({ type: types.GET_ASSIGNED_TO_RECORDS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchGetAssignedFrom() {
  yield takeEvery(types.GET_ASSIGNED_FROM_RECORDS, function* foo(action) {
    let result;
    try {
      const { companyId, type } = action.data;
      result = yield call(getAllAssignedFromRecords, companyId, type);
      yield put({ type: types.GET_ASSIGNED_FROM_RECORDS_SUCCESS, data: { collection: result.data, type, companyId } });
    } catch (e) {
      yield put({ type: types.GET_ASSIGNED_FROM_RECORDS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* assignedRoot() {
  yield all([
    call(watchGetAllAssignedTo),
    call(watchGetAllAssignedFrom),
    call(watchGetAssignedTo),
    call(watchGetAssignedFrom),
  ])
}