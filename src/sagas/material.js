import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import { getMaterialApi } from './apis';

export function* watchGetMaterials() {
  yield takeEvery(types.GET_MATERIAL, function* foo(action) {
    let result;
    try {
      result = yield call(getMaterialApi);
      yield put({ type: types.GET_MATERIAL_SUCCESS, data: { collection: result.data}});
    } catch (e) {
      console.error('get company product material', e.response, e);
      yield put({ type: types.GET_MATERIAL_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}


export default function* materialRoot() {
  yield all([
    call(watchGetMaterials),
  ]);
}