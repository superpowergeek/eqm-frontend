import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const companyPurchases = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_PURCHASES_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_COMPANY_PURCHASES_SUCCESS: {
      const { record, companyId } = action.data;
      return addNewRecordAndUpdateState(state, companyId, record);
    }
    case types.DELETE_COMPANY_PURCHASES_SUCCESS: {
      const { companyId, recordId } = action.data;
      return deleteRecordAndUpdateState(state, companyId, recordId);
    }
    case types.UPDATE_COMPANY_PURCHASES_SUCCESS: {
      const { companyId, recordId, data } = action.data;
      return updateRecordAndState(state, companyId, recordId, data);
    }
    default: return state;
  }
}

export default companyPurchases;