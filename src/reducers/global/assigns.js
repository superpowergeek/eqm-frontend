// get all assign to others records divided by assignableType
import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

// TODO: should refact as with ids[], idMap{};
const assigns = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSIGNED_RECORDS_SUCCESS: {
      // itemId is fuelConsumptionId or wasteId or travelId
      const { collection, id: itemId, type } = action.data;
      return {
        ...state,
        [type]: updateWithCollectionByKeyWithIdMap(state[type], collection, itemId),
      }
    }
    case types.DELETE_ASSIGN_RECORD_SUCCESS: {
      const { recordId, type, itemId } = action.data;
      if (!state[type]) return state;
      return {
        ...state,
        [type]: deleteRecordAndUpdateState(state[type], itemId, recordId),
      }
    }
    case types.UPDATE_ASSIGN_RECORD_SUCCESS: {
      const { record, recordId, type, itemId } = action.data;
      if (!state[type]) return state;
      return {
        ...state,
        [type]: updateRecordAndState(state[type], itemId, recordId, record),
      }
    }
    case types.ADD_ASSIGN_RECORD_SUCCESS: {
      const { record, type, itemId } = action.data;
      if (!state[type]) return state;
      return {
        ...state,
        [type]: addNewRecordAndUpdateState(state[type], itemId, record),
      }
    }
    default: return state;
  }
}

export default assigns;