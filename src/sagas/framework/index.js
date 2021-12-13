import { all, call } from 'redux-saga/effects';
import categorySagas from './category';
import collectionSagas from './collection';

export default function* frameworkRoot() {
  yield all([
    call(categorySagas),
    call(collectionSagas),
  ])
}