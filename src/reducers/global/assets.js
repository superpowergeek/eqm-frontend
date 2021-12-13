import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const assets = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSETGROUP_ALL_ASSETS_SUCCESS: {
      const { collection, groupId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, groupId);
      
    }
    case types.ADD_ASSET_SUCCESS: {
      const { record, groupId } = action.data;
      return addNewRecordAndUpdateState(state, groupId, record);
    }
    case types.UPDATE_ASSET_SUCCESS: {
      const { record, groupId, recordId } = action.data;
      return updateRecordAndState(state, groupId, recordId, record);

    }
    default: return state;
  }
}

export default assets;
