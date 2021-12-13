import { all, takeEvery, put, call } from 'redux-saga/effects';
import types from '@constants/actions';
import { getFrameworks } from '../apis';

function* watchGetFrameworks() {
  yield takeEvery(types.GET_FRAMEWORKS, function* foo(action) {
    try {
      const { companyId } = action.data;
      const { data } = yield call(getFrameworks, companyId);
      yield put({ type: types.GET_FRAMEWORKS_SUCCESS, data: { collection: data }});
    } catch (e) {
      console.log('error', e);
      yield put({ type: types.GET_FRAMEWORKS_ERROR, error: e });
    }
  })
}

export default function* collectionRoot() {
  yield all([
    call(watchGetFrameworks),
  ])
}