import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';
import types from '@constants/actions';
import { 
  forgotPassword,
} from './apis';

export function* watchForgotPassword() {
  yield takeEvery(types.FORGOT_PASSWORD, function* foo(action) {
    try {
      const { email } = action.data;
      yield call(forgotPassword, email);
      // yield put({ type: types.FORGOT_PASSWORD_SUCCESS, data: { collection: result.data }});
    } catch (e) {
      yield put({ type: types.FORGOT_PASSWORD_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* forgotPasswordRoot() {
  yield all([
    call(watchForgotPassword),
  ])
}