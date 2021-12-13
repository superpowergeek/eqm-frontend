import { all, call, put, takeEvery, cancelled } from 'redux-saga/effects';

import types from '@constants/actions';
import { 
  getAssetsApi,
  getWastesByAsset,
  getFuelConsumptionsByAsset,
  getUntilitesByAsset,
  getAssetRefrigeratorConsumptionsByAsset,
  addAssetApi,
  updateAssetApi,
} from './apis';

export function* watchAddAsset() {
  yield takeEvery(types.ADD_ASSET, function* foo(action) {
    let result;
    try {
      const { groupId, country, ...others } = action.data;
      const payload = {
        fleetId: groupId,
        countryId: country.id,
        ...others,
      };
      result = yield call(addAssetApi, payload);
      yield put({ type: types.ADD_ASSET_SUCCESS, data: { record: result.data, groupId }});
    } catch(e) {
      yield put({ type: types.ADD_ASSET_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  });
}

export function* watchDeleteAsset() {
  yield takeEvery(types.DELETE_ASSET, function* foo(action) {
    let result;
    try {
      const { recordId, groupId } = action.data;
      // result = yield call(deleteAssetApi);
      // yield put({ type: types.DELETE_ASSET_SUCCESS, data: { recordId, assetGroupId, }});
    } catch (e) {
      yield put({ type: types.ADD_ASSET_ERROR, error: e });
    } finally {

    }
  });
}

export function* watchUpdateAsset() {
  yield takeEvery(types.UPDATE_ASSET, function* foo(action) {
    try {
      const { groupId, name, description, recordId, tags } = action.data;
      const payload = {
        name,
        description,
        tags
      };
      const updateResult = yield call(updateAssetApi, recordId, payload);
      yield put({ type: types.UPDATE_ASSET_SUCCESS, data: { record: updateResult.data, groupId, recordId } });
    } catch (e) {
      yield put({ type: types.UPDATE_ASSET_ERROR, error: e });
    }
  });
}


export function* watchGetAssetAllProducts() {
  yield takeEvery(types.GET_ASSET_ALL_PRODUCTS, function* foo(action) {
    const { assetId } = action.data;
    
    const consumptions = yield call(getFuelConsumptionsByAsset, assetId);
    yield put({ type: types.GET_ASSET_ALL_FUELCONSUMPTIONS_SUCCESS, data: { collection: consumptions.data, assetId }});
    
    const wastes = yield call(getWastesByAsset, assetId);
    yield put({ type: types.GET_ASSET_ALL_WASTES_SUCCESS, data: { collection: wastes.data, assetId }});

    const utilities = yield call(getUntilitesByAsset, assetId);
    yield put({ type: types.GET_ASSET_ALL_UTILITIES_SUCCESS, data: { collection: utilities.data, assetId }});

    const refrigeratorConsumptions = yield call(getAssetRefrigeratorConsumptionsByAsset, assetId);
    yield put({ type: types.GET_ASSET_ALL_REFRIGERATORCONSUMPTIONS_SUCCESS, data: { collection: refrigeratorConsumptions.data, assetId }});

  });
}

export function* watchGetAllAssetGroupSuccess() {
  yield takeEvery(types.GET_COMPANY_ALL_ASSETGROUPS_SUCCESS, function* foo (action) {
    const { collection } = action.data;
    try {
      yield all (collection.map(assetGroup => {
        const { id: groupId } = assetGroup;
        return put({ type: types.GET_ASSETGROUP_ALL_ASSETS, data: { groupId } });
      }))
    } catch (e) {

    };
  })
}
export function* watchGetAssets() {
  yield takeEvery(types.GET_ASSETGROUP_ALL_ASSETS, function* foo (action) {
    let result;
    const { groupId } = action.data;
    try {
      result = yield call(getAssetsApi, groupId);
      yield put({ type: types.GET_ASSETGROUP_ALL_ASSETS_SUCCESS, data: { collection: result.data, groupId }});
    } catch (e) {
      console.error('get assets', e.response, e);
      yield put({ type: types.GET_ASSETGROUP_ALL_ASSETS_ERROR, error: e });
    } finally {
      if (yield cancelled()) {
        //result[CANCEL]();
      }
    }
  })
}

export default function* assetRoot() {
  yield all([
    call(watchGetAssets),
    call(watchGetAllAssetGroupSuccess),
    call(watchGetAssetAllProducts),
    call(watchAddAsset),
    call(watchDeleteAsset),
    call(watchUpdateAsset),
  ])
}