import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import { 
  getAssetGroupsApi,
  addAssetGroupApi,
  updateAssetGroupApi,
} from './apis'; 

export function* watchGetAssetGroups() {
  yield takeEvery(types.GET_COMPANY_ALL_ASSETGROUPS, function* foo (action) {
    let result;
    const { companyId } = action.data;
    try {
      result = yield call(getAssetGroupsApi, companyId);
      yield put({ type: types.GET_COMPANY_ALL_ASSETGROUPS_SUCCESS, data: { collection: result.data, companyId }});
    } catch (e) {
      console.error('get asset groups', e.response, e);
      yield put({ type: types.GET_COMPANY_ALL_ASSETGROUPS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export function* watchAddAsseGroup() {
  yield takeEvery(types.ADD_ASSETGROUP, function* foo(action){
    let result;
    try{
      const { companyId, name, description, ...others } = action.data;
      const payload = {
        companyId: companyId,
        name: name,
        description: description,
        ...others,
      };
      result = yield call(addAssetGroupApi, payload);
      yield put({ type: types.ADD_ASSETGROUP_SUCCESS, data: { record: result.data, companyId }});
    } catch(e){
      yield put({ type: types.ADD_ASSETGROUP_ERROR ,error: e});
    } finally{
      if (yield cancelled()){
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateAssetGroups() {
  yield takeEvery(types.UPDATE_ASSETGROUP, function* foo(action) {
    try {
      const { companyId, name, description, recordId } = action.data;
      const updateResult = yield call(updateAssetGroupApi, recordId, { name, description });
      yield put({ type: types.UPDATE_ASSETGROUP_SUCCESS, data: { record: updateResult.data, companyId, recordId } });
    } catch (e) {
      yield put({ type: types.UPDATE_ASSETGROUP_ERROR, error: e });
    }
  });
}

export default function* assetGroupRoot() {
  yield all([
    call(watchGetAssetGroups),
    call(watchAddAsseGroup),
    call(watchUpdateAssetGroups),
  ])
}