import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';


import types from '@constants/actions';
import {
  addAssetApi,
  updateAssetApi,
  addLeaseAssetApi,
  updateLeaseAssetApi
} from './apis';

export function* watchAddLeaseAsset() {
  yield takeEvery(types.ADD_LEASE_ASSET, function* foo(action) {
    try {
      const { groupId, country, companyId, emissionId, amount, ...others } = action.data;
      const payload = {
        fleetId: groupId,
        countryId: country.id,
        ...others,
      };
      const assetResult = yield call(addAssetApi, payload);
      const leasePayload = {
        emissionId,
        amount,
        companyId,
        assetId: assetResult.data.id,
        leasedStartDate: 1589428338000
      }
      const leaseResult = yield call(addLeaseAssetApi, leasePayload);
      const record = { ...assetResult.data, leasedAsset: leaseResult.data }
      yield put({ type: types.ADD_ASSET_SUCCESS, data: { record, groupId }});
    } catch(e) {
      yield put({ type: types.ADD_ASSET_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchUpdateLeaseAsset() {
  yield takeEvery(types.UPDATE_LEASE_ASSET, function* foo(action) {
    try {
      const { country, groupId, companyId, emissionId, amount, recordId, leaseAssetId, ...others } = action.data;
      const payload = {
        countryId: country.id,
        ...others,
      };
      const assetResult = yield call(updateAssetApi, recordId, payload);
      const leasePayload = {
        emissionId,
        amount,
        companyId,
        leasedStartDate: 1589428338000
      }
      const leaseResult = yield call(updateLeaseAssetApi, leaseAssetId, leasePayload);
      const record = { ...assetResult.data, leasedAsset: leaseResult.data }
      yield put({ type: types.UPDATE_ASSET_SUCCESS, data: { record, groupId, recordId }});
    } catch(e) {
      yield put({ type: types.UPDATE_ASSET_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export default function* leaseAssetRoot() {
  yield all([
    call(watchAddLeaseAsset),
    call(watchUpdateLeaseAsset)
  ])
}