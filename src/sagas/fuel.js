import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import types from '@constants/actions';
import { 
  getFuels,
} from './apis';

export function* watchGetFuels() {
  yield takeEvery(types.GET_FUELS, function* foo(action) {
    let result;
    try {
      result = yield call(getFuels);
      yield put({ type: types.GET_FUELS_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      yield put({ type: types.GET_FUELS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* fuelRoot() {
  yield all([
    call(watchGetFuels),
  ])
}