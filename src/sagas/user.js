import { all, call, put, select, takeEvery, cancelled } from 'redux-saga/effects';
// import { push } from 'connected-react-router';
import types from '@constants/actions';
import RequestApi from 'utils/RequestApi';
import * as Selectors from 'selectors';
import HeaderManager from 'utils/HeaderManager';

export function* watchGetUserSuccess() {
  yield takeEvery(types.GET_USER_SUCCESS, function* foo(action) {
    const session = yield select(Selectors.selectSession);
    yield put({ type: types.SESSION_VERIFIED, data: { token: session.token } })
  })
}

export function* watchGetUserError() {
  yield takeEvery(types.GET_USER_ERROR, function* foo(action) {
    yield put({ type: types.CLEAR_SESSION_CACHE });
    yield put({ type: types.CLEAR_ERROR_RESPONSE });
  })
}

export function* watchGetUser () {
  yield takeEvery(types.GET_USER, function* foo(action) {
    let result;
    const {
      userId,
      token,
    } = action.data;
    HeaderManager.set('Authorization', `Bearer ${token}`);
    try {
      result = yield RequestApi({
        url: `/user/${userId}`,
        method: 'get',
      })
      yield put({ 
        type: types.GET_USER_SUCCESS,
        data: {
          user: result.data,
        },
      });
    } catch (e) {
      yield put({ 
        type: types.GET_USER_ERROR,
        error: {
          e,
        },
      });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
  
}
export function* watchUpdateUser() {
  yield takeEvery(types.UPDATE_USER, function* foo(action) {
    let result;
    const {
      field,
      value,
      id,
    } = action.data;
    const data = new FormData();
    data.set([field], value);
    try {
      result = yield RequestApi({
        url: `/user/${field}/${id}`,
        method: 'post',
        headers: {'Content-Type': 'multipart/form-data' },
        data,
      });
      yield put({ 
        type: types.UPDATE_USER_SUCCESS,
        data: {
          user: result.data,
        },
      });
    } catch (e) {
      console.warn('update user', e.response);
      yield put({ type: types.UPDATE_USER_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* root() {
  yield all([
    call(watchUpdateUser),
    call(watchGetUser),
    call(watchGetUserSuccess),
    call(watchGetUserError),
  ])
}