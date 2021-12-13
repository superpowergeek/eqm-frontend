// get all and [assigned from] others records
import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
} from 'utils/functions';

const assignedTo = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSIGNED_TO_RECORDS_SUCCESS: {
      const { collection, companyId, type } = action.data;
      const prevCompanyData = state[companyId] || {};
      return {
        ...state,
        [companyId]: updateWithCollectionByKeyWithIdMap(prevCompanyData, collection, type),
      }
    }
    case types.ADD_ASSIGN_RECORD_SUCCESS: {
      const { record, type, companyId } = action.data;
      const prevCompanyData = state[companyId] || {};
      return {
        ...state,
        [companyId]: addNewRecordAndUpdateState(prevCompanyData, type, record),
      }
    }
    case types.DELETE_ASSIGN_RECORD_SUCCESS: {
      const { recordId, type, companyId } = action.data;
      const prevCompanyData = state[companyId] || {};
      return {
        ...state,
        [companyId]: deleteRecordAndUpdateState(prevCompanyData, type, recordId),
      }
    }
    default: return state;
  }
}

export default assignedTo;

