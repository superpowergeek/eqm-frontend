import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
} from 'utils/functions';
/*
  [
    {
      "id": 1,
      "createdAt": 1587433929000,
      "name": "Main",
      "preferredFuelType": {
        "id": 2,
        "createdAt": 1587433929000,
        "name": "MDO/MGO",
        "lastModifiedAt": 1587433929000
      },
      "engine": {
        "id": 3,
        "createdAt": 1587433929000,
        "name": "High-speed diesel",
        "lastModifiedAt": 1587433929000
      },
      "lastModifiedAt": 1587433929000
    }
  ]
*/
const assetEngine = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSET_ENGINES_SUCCESS: {
      const { collection, assetId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, assetId);
    }
    case types.ADD_ASSETENGINE_SUCCESS: {
      const { record, assetId } = action.data;
      return addNewRecordAndUpdateState(state, assetId, record);
    }
    case types.DELETE_ASSETENGINE_SUCCESS: {
      const { recordId, assetId } = action.data;
      return deleteRecordAndUpdateState(state, assetId, recordId);
    }
    case types.GET_ASSETENGINE_AVAIL_FUELS_SUCCESS: {
      const { assetEngineId, availFuels, assetId } = action.data;
      const prevIdMap = (state[assetId] && state[assetId].idMap) || {};
      const prevIds = (state[assetId] && state[assetId].ids) || [];
      prevIdMap[assetEngineId] = {
        ...prevIdMap[assetEngineId],
        availFuels,
      }
      
      return {
        ...state,
        [assetId]: {
          ids: prevIds,
          idMap: prevIdMap,
        }
      }
    }
    default: return state;
  }
}

export default assetEngine;
