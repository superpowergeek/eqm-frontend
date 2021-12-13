import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
} from 'utils/functions';

const companyTravel = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_TRAVEL_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_COMPANY_TRAVEL_SUCCESS: {
      const { record, companyId } = action.data;
      return addNewRecordAndUpdateState(state, companyId, record)
    }
    case types.DELETE_COMPANY_TRAVEL_SUCCESS: {
      const { companyId, recordId } = action.data;
      return deleteRecordAndUpdateState(state, companyId, recordId);
    }
    default: return state;
  }
}

export default companyTravel;