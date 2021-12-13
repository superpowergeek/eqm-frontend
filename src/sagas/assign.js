import { all, call, put, select, takeEvery, takeLatest, cancelled } from 'redux-saga/effects';
import { CANCEL } from 'redux-saga';
import moment from 'moment';
import { assignableTypes } from '@constants';
import types from '@constants/actions';
import * as Seletors from 'selectors';
import {
  getAssignRecordsWithTypeAndId,
  addAssignRecordWithTypeAndId,
  updateAssignRecordWithTypeAndId,
  deleteAssignRecordWithTypeAndId,
  addAssetFuelConsumption,
  addAssetUtility,
  addAssetWaste,
  addAssetRefrigeratorConsumption,
  deleteAssetFuelConsumption,
  deleteAssetWaste,
  deleteAssetUtility,
  deleteAssetRefrigeratorConsumption,
} from './apis';


export function* wastchGetAssetAssign() {
  yield takeEvery(types.GET_ASSIGNED_RECORDS, function* foo(action) {
    try {
      const { id, type } = action.data;
      const assignRecords = yield call(getAssignRecordsWithTypeAndId, type, id);
      yield put({ type: types.GET_ASSIGNED_RECORDS_SUCCESS, data: { collection: assignRecords.data, id, type }});
    } catch (e) {

    }
  });
}

export function* watchAddAssignAbleAsset() {
  yield takeEvery(types.ADD_ASSIGNABLEASSET, function* foo(action){
    let result;
    try{
      const { amount, assetType, inputType, assetId, assetEngineId, assetRefrigeratorId, refrigerantId } = action.data;
      const time = moment().format('x');
      if (assetType === assignableTypes.FUEL_CONSUMPTION) {
        const payload = {
          fuelTypeId: inputType,
          assetEngineId,
          amount,
          assetId,
          time,
        };
        result = yield call(addAssetFuelConsumption, payload);
      }
      if (assetType === assignableTypes.WASTE) {
        const payload = {
          type: inputType,
          amount,
          assetId,
          time,
        };
        result = yield call(addAssetWaste, payload);
      }
      if (assetType === assignableTypes.UTILITY) {
        const payload = {
          type: inputType,
          meter: amount,
          assetId,
          time,
        };
        result = yield call(addAssetUtility, payload);
      }
      if (assetType === assignableTypes.REFRIGERATOR_CONSUMPTION) {
        const payload = {
          assetRefrigeratorId,
          refrigerantId,
          amount,
          assetId,
          time,
        };
        result = yield call(addAssetRefrigeratorConsumption, payload);
      }
      yield put({ type: types.ADD_ASSIGNABLEASSET_SUCCESS, data: { record: result.data, assetId, assetType }});
    } catch(e){
      yield put({ type: types.ADD_ASSIGNABLEASSET_ERROR, error: e});
    } finally{
      if(yield cancelled()){
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteAssignableAsset() {
  yield takeEvery(types.DELETE_ASSIGNABLEASSET, function* foo(action) {
    let deleteResult;
    try {
      const { recordId, assetType, assetId } = action.data;
      if (assetType === assignableTypes.FUEL_CONSUMPTION){
        deleteResult = yield call(deleteAssetFuelConsumption,recordId);
      }
      if (assetType === assignableTypes.WASTE) {
        deleteResult = yield call(deleteAssetWaste, recordId);
      }
      if (assetType === assignableTypes.UTILITY) {
        deleteResult = yield call(deleteAssetUtility, recordId);
      }
      if (assetType === assignableTypes.REFRIGERATOR_CONSUMPTION) {
        deleteResult = yield call(deleteAssetRefrigeratorConsumption, recordId);
      }
      yield put({ type: types.DELETE_ASSIGNABLEASSET_SUCCESS, data: { recordId, assetType, assetId } });
    } catch (e){
      // console.log(e)
      yield put({ type: types.DELETE_ASSIGNABLEASSET_ERROR, error: e});
    } finally{
      if(yield cancelled()){
        deleteResult[CANCEL]();
      }
    }
  });
}

export function* watchDeleteAssignRecord() {
  yield takeEvery(types.DELETE_ASSIGN_RECORD, function* foo(action) {
    try {
      const companyId = yield select(Seletors.selectUserCompanyId);
      const { recordId, type, itemId } = action.data;
      yield call(deleteAssignRecordWithTypeAndId, type, recordId);
      yield put({ type: types.DELETE_ASSIGN_RECORD_SUCCESS, data: { recordId, type, itemId, companyId }});
    } catch (e) {
      yield put({ type: types.DELETE_ASSIGN_RECORD_ERROR, error: e });
      console.log('delete error', e);
    }
  })
}

export function* watchUpdateAssignRecord() {
  yield takeEvery(types.UPDATE_ASSIGN_RECORD, function* foo(action) {
    try {
      const { percent, type, itemId, recordId } = action.data;
      const updateResult = yield call(updateAssignRecordWithTypeAndId, { percent }, type, itemId, recordId);
      yield put({ type: types.UPDATE_ASSIGN_RECORD_SUCCESS, data: { record: updateResult.data, type, itemId, recordId } })
    } catch (e) {
      yield put({ type: types.UPDATE_ASSIGN_RECORD_ERROR, error: e });
    }
  });
}

export function* watchAddAssignRecord() {
  yield takeLatest(types.ADD_ASSIGN_RECORD, function* foo(action) {
    try {
      const { percent, parentId, type, itemId } = action.data;
      const companyId = yield select(Seletors.selectUserCompanyId);
      const payload = {
        percent,
        parentId,
        childId: companyId,
      }
      const addResult = yield call(addAssignRecordWithTypeAndId, payload, type, itemId);

      // const fakeResult = {
      //   id: 'fakeId',
      //   percent,
      //   company: {
      //     id: 1,
      //     name: "New Company",
      //   },
      //   lastModifiedAt: 1587433929000,
      // }
      yield put({ type: types.ADD_ASSIGN_RECORD_SUCCESS, data: { record: addResult.data, type, itemId, companyId } })
    } catch (e) {
      yield put({ type: types.ADD_ASSIGN_RECORD_ERROR, error: e });
      console.log('add assign record er', e);
    }
  })
}


export default function* assignRoot() {
  yield all([
    call(wastchGetAssetAssign),
    call(watchAddAssignRecord),
    call(watchUpdateAssignRecord),
    call(watchDeleteAssignRecord),
    call(watchAddAssignAbleAsset),
    call(watchDeleteAssignableAsset),
  ])
}