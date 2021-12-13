import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import types from '@constants/actions';
import { 
  resetPassword,
} from './apis';

export function* watchResetPassword() {
  yield takeEvery(types.RESET_PASSWORD, function* foo(action) {
    try {
      yield call(resetPassword, action.data);
      // yield put({ type: types.RESET_PASSWORD_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      yield put({ type: types.RESET_PASSWORD_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* resetPasswordRoot() {
  yield all([
    call(watchResetPassword),
  ])
}