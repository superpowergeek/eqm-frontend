import types from '@constants/actions';
import { assignableTypes } from '@constants';
import { 
  updateWithSumCollectionByKeyWithIdMap,
  addNewRecordAndUpdateStateWithSum,
  deleteRecordAndUpdateStateWithSum,
} from 'utils/functions';
/*
  [{ each fuelConsumption
    "id": 17,
    "createdAt": 1589428338000,
    "amount": 38.0,
    "time": 1.588384326422E12,
    "fuelType": {
        "id": 1,
        "createdAt": 1587433929000,
        "name": "BFO",
        "lastModifiedAt": 1587433929000
    },
    "lastModifiedAt": 1589428338000
  }]
*/
const assetFuelConsumption = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSET_ALL_FUELCONSUMPTIONS_SUCCESS: {
      const { collection, assetId } = action.data;
      return updateWithSumCollectionByKeyWithIdMap(state, collection, assetId, {
        getTime: row => row.lastModifiedAt,
        getAmount: row => row.amount,
      });
    }
    case types.ADD_ASSIGNABLEASSET_SUCCESS: {
      const { assetType } = action.data;
      if (assetType === assignableTypes.FUEL_CONSUMPTION) {
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
      if (assetType === assignableTypes.FUEL_CONSUMPTION) {
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

export default assetFuelConsumption;
