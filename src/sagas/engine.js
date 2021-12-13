import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import types from '@constants/actions';
import { 
  getEngines,
} from './apis';

export function* watchGetEngines() {
  yield takeEvery(types.GET_ENGINES, function* foo(action) {
    let result;
    try {
      result = yield call(getEngines);
      yield put({ type: types.GET_ENGINES_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      yield put({ type: types.GET_ENGINES_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* engineRoot() {
  yield all([
    call(watchGetEngines),
  ])
}