import { all, takeEvery, put, call } from 'redux-saga/effects';
import types from '@constants/actions';
import { getFrameworkCategories } from '../apis';

function* watchGetFrameworkCategories() {
  yield takeEvery(types.GET_FRAMEWORK_CATEGORIES, function* foo(action) {
    try {
      const { frameworkId, companyId } = action.data;
      const { data } = yield call(getFrameworkCategories, { frameworkId, companyId });
      yield put({ type: types.GET_FRAMEWORK_CATEGORIES_SUCCESS, data: { collection: data, frameworkId, companyId }});
    } catch (e) {
      yield put({ type: types.GET_FRAMEWORK_CATEGORIES_ERROR, error: e });
    }
  });
}

export default function* categoryRoot() {
  yield all([
    call(watchGetFrameworkCategories),
  ])
}