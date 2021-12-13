// temporary sagas might drop in next feature update
import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import types from '@constants/actions';
import * as Selectors from 'selectors';

export default function* tmpRoot() {
  yield all([
  ]);
}