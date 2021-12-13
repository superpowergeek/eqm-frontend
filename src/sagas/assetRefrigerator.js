import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import { CANCEL } from 'redux-saga';
import types from '@constants/actions';
import {
  addAssetRefrigeratorApi,
  deleteAssetRefrigeratorApi,
  getAssetRefrigerators,
} from './apis';

export function* watchGetAssetRefrigerator() {
  yield takeEvery(types.GET_ASSET_REFRIGERATORS, function* foo(action) {
    let result;
    const { assetId } = action.data;
    try {
      result = yield call(getAssetRefrigerators, assetId);
      yield put({ type: types.GET_ASSET_REFRIGERATORS_SUCCESS, data: { collection: result.data, assetId }});
    } catch (e) {
      console.error('get asset refrigerators', e.response, e);
      yield put({ type: types.GET_ASSET_REFRIGERATORS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}


export function* watchAddAssetRefrigerator() {
  yield takeEvery(types.ADD_REFRIGERATOR, function* foo(action){
    let result;
    try {
      const { assetId, name, capacity } = action.data;
      const payload = {
        assetId,
        name,
        capacity,
      }
      result = yield call(addAssetRefrigeratorApi,payload);
      yield put({ type: types.ADD_REFRIGERATOR_SUCCESS, data: { record: result.data, assetId } });
    } catch (e) {
      yield put({type: types.ADD_REFRIGERATOR_ERROR, error: e });
    } finally{
      if (yield cancelled()){
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteAssetRefrigerator() {
  yield takeEvery(types.DELETE_REFRIGERATOR, function* foo(action){
    let deleteResult;
    try {
      const { recordId, assetId } = action.data;
      deleteResult = yield call(deleteAssetRefrigeratorApi, recordId);
      yield put({ type: types.DELETE_ASSETENGINE_SUCCESS, data: { recordId, assetId } });
    } catch (e){
      yield put({ type: types.DELETE_ASSETENGINE_ERROR, error: e});
    } finally{
      if(yield cancelled()){
        deleteResult[CANCEL]();
      }
    }
  });
}

export default function* assetGroupRoot() {
  yield all([
    call(watchGetAssetRefrigerator),
    call(watchAddAssetRefrigerator),
    call(watchDeleteAssetRefrigerator),
  ])
}