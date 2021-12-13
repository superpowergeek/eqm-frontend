import types from '@constants/actions';
import { assignableTypes } from '@constants';
import { 
  updateWithSumCollectionByKeyWithIdMap,
  addNewRecordAndUpdateStateWithSum,
  deleteRecordAndUpdateStateWithSum,
} from 'utils/functions';

const assetUtility = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSET_ALL_UTILITIES_SUCCESS: {
      const { collection, assetId } = action.data;
      return updateWithSumCollectionByKeyWithIdMap(state, collection, assetId, {
        getTime: row => row.lastModifiedAt,
        getAmount: row => row.meter,
      });
    }
    case types.ADD_ASSIGNABLEASSET_SUCCESS: {
      const { assetType } = action.data;
      if (assetType === assignableTypes.UTILITY) {
        const { record, assetId } = action.data;
        return addNewRecordAndUpdateStateWithSum(state, assetId, record, {
          getTime: row => row.lastModifiedAt,
          getAmount: row => row.meter,
        });
      }
      return state;
    }
    case types.DELETE_ASSIGNABLEASSET_SUCCESS: {
      const { assetType } = action.data;
      if (assetType === assignableTypes.UTILITY) {
        const { recordId, assetId } = action.data;
        return deleteRecordAndUpdateStateWithSum(state, assetId, recordId, {
          getTime: row => row.lastModifiedAt,
          getAmount: row => row.meter,
        });
      }
      return state;
    }
    default: return state;
  }
}

export default assetUtility;