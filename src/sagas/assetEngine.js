import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import { CANCEL } from 'redux-saga';
import types from '@constants/actions';
import { 
  getAssetEngines,
  addAssetEngineApi,
  deleteAssetEngineApi,
  getAssetEngineAvailFuels,
} from './apis';

export function* watchGetAssetEngine() {
  yield takeEvery(types.GET_ASSET_ENGINES, function* foo(action) {
    let result;
    const { assetId } = action.data;
    try {
      result = yield call(getAssetEngines, assetId);
      yield put({ type: types.GET_ASSET_ENGINES_SUCCESS, data: { collection: result.data, assetId }});
    } catch (e) {
      console.error('get asset engines', e.response, e);
      yield put({ type: types.GET_ASSET_ENGINES_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchGetAssetEngineSuccess() {
  yield takeEvery(types.GET_ASSET_ENGINES_SUCCESS, function* foo(action) {
    const { collection, assetId } = action.data;
    try {
      yield all(collection.map(assetEngine => put({ type: types.GET_ASSETENGINE_AVAIL_FUELS, data: { assetEngineId: assetEngine.id, assetId }})))
    } catch (e) {
      console.error('put get avail error', e.response, e);
    }
  });
}

export function* watchGetAssetEngineAvailFuels() {
  yield takeEvery(types.GET_ASSETENGINE_AVAIL_FUELS, function* foo(action) {
    let result;
    const { assetEngineId, assetId } = action.data;
    try {
      result = yield call(getAssetEngineAvailFuels, assetEngineId);
      yield put({ type: types.GET_ASSETENGINE_AVAIL_FUELS_SUCCESS, data: { availFuels: result.data, assetEngineId, assetId }});
    } catch (e) {
      console.error('get asset engines', e.response, e);
      yield put({ type: types.GET_ASSETENGINE_AVAIL_FUELS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchAddAssetEngine() {
  yield takeEvery(types.ADD_ASSETENGINE, function* foo(action){
    let result;
    try {
      const { assetId, name, engineId, fuelTypeId } = action.data;
      const payload = {
        assetId,
        name,
        engineId,
        fuelTypeId,
      }
      result = yield call(addAssetEngineApi,payload);
      yield put({ type: types.ADD_ASSETENGINE_SUCCESS, data: { record: result.data, assetId } });
      yield put({ type: types.GET_ASSETENGINE_AVAIL_FUELS, data: { assetEngineId: result.data.id, assetId }});
    } catch (e) {
      yield put({type: types.ADD_ASSETENGINE_ERROR, error: e });
    } finally{
      if (yield cancelled()){
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteAssetEngine() {
  yield takeEvery(types.DELETE_ASSETENGINE, function* foo(action){
    let deleteResult;
    try {
      const { recordId, assetId } = action.data;
      deleteResult =  yield call(deleteAssetEngineApi,recordId);
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
    call(watchGetAssetEngine),
    call(watchAddAssetEngine),
    call(watchDeleteAssetEngine),
    call(watchGetAssetEngineAvailFuels),
    call(watchGetAssetEngineSuccess),
  ])
}