import types from '@constants/actions';
import { assignableTypes } from '@constants';
import { 
  updateWithSumCollectionByKeyWithIdMap,
  addNewRecordAndUpdateStateWithSum,
  deleteRecordAndUpdateStateWithSum,
} from 'utils/functions';

const assetRefrigeratorConsumption = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSET_ALL_REFRIGERATORCONSUMPTIONS_SUCCESS: {
      const { collection, assetId } = action.data;
      return updateWithSumCollectionByKeyWithIdMap(state, collection, assetId, {
        getTime: row => row.lastModifiedAt,
        getAmount: row => row.amount,
      });
    }
    case types.ADD_ASSIGNABLEASSET_SUCCESS: {
      const { assetType } = action.data;
      if (assetType === assignableTypes.REFRIGERATOR_CONSUMPTION) {
        const { record, assetId } = action.data;        
        return addNewRecordAndUpdateStateWithSum(state, assetId, record, {
          getTime: row => row.lastModifiedAt,
          getAmount: row => row.amount,
        });
      }
      return state;
    }
    case types.DELETE_ASSIGNABLEASSET_SUCCESS: {
      const { assetType } = action.data;
      if (assetType === assignableTypes.REFRIGERATOR_CONSUMPTION) {
        const { recordId, assetId } = action.data;
        return deleteRecordAndUpdateStateWithSum(state, assetId, recordId, {
          getTime: row => row.lastModifiedAt,
          getAmount: row => row.amount,
        });
      }
      return state;
    }
    default: return state;
  }
}

export default assetRefrigeratorConsumption;
