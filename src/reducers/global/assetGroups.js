import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const assetGroups = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_ALL_ASSETGROUPS_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_ASSETGROUP_SUCCESS: {
      const {record, companyId} = action.data;
      return addNewRecordAndUpdateState(state, companyId, record);
    }
    case types.UPDATE_ASSETGROUP_SUCCESS: {
      const {record, companyId, recordId } = action.data;
      return updateRecordAndState(state, companyId, recordId, record);
    }
    default: return state;
  }
}

export default assetGroups;
