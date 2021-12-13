import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
} from 'utils/functions';

const assetRefrigerator = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSET_REFRIGERATORS_SUCCESS: {
      const { collection, assetId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, assetId);
    }
    case types.ADD_REFRIGERATOR_SUCCESS: {
      const { record, assetId } = action.data;
      return addNewRecordAndUpdateState(state, assetId, record);
    }
    case types.DELETE_REFRIGERATOR_ERROR: {
      const { recordId, assetId } = action.data;
      return deleteRecordAndUpdateState(state, assetId, recordId);
    }
    default: return state;
  }
}

export default assetRefrigerator;
