import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
} from 'utils/functions';

const companyWaste = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_WASTE_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_COMPANY_WASTE_SUCCESS: {
      const { record, companyId } = action.data;
      return addNewRecordAndUpdateState(state, companyId, record);
    }
    case types.DELETE_COMPANY_WASTE_SUCCESS: {
      const { companyId, recordId } = action.data;
      return deleteRecordAndUpdateState(state, companyId, recordId);
    }

    case types.UPDATE_COMPANY_WASTE_SUCCESS: {
      const { companyId, recordId, data } = action.data;
      const prevIdMap = (state[companyId] && state[companyId].idMap) || {};
      const ids = (state[companyId] && state[companyId].ids) || [];
      const idMap = {
        ...prevIdMap,
        [recordId]: data,
      }
      return {
        ...state,
        [companyId]: {
          ids,
          idMap,
        }
      }
    }
    default: return state;
  }
}

export default companyWaste;