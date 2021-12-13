import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import types from '@constants/actions';
import { 
  getEmissions,
} from './apis';

export function* watchGetEmissions() {
  yield takeEvery(types.GET_EMISSIONS, function* foo(action) {
    let result;
    try {
      result = yield call(getEmissions);
      yield put({ type: types.GET_EMISSIONS_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      yield put({ type: types.GET_EMISSIONS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* emissionRoot() {
  yield all([
    call(watchGetEmissions),
  ])
}