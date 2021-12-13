import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import types from '@constants/actions';
import { 
  getSpendCosts,
} from './apis';

export function* watchGetSpendCosts() {
  yield takeEvery(types.GET_SPENDCOSTS, function* foo(action) {
    let result;
    try {
      result = yield call(getSpendCosts);
      yield put({ type: types.GET_SPENDCOSTS_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      yield put({ type: types.GET_SPENDCOSTS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* spendCostRoot() {
  yield all([
    call(watchGetSpendCosts),
  ])
}