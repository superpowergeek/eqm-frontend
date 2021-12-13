import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const category = (state = {}, action) => {

  switch (action.type) {
    case types.GET_FRAMEWORK_CATEGORIES_SUCCESS: {
      const { collection, frameworkId, companyId } = action.data;
      const prevCompanyData = state[companyId] || {};
      return {
        ...state,
        [companyId]: updateWithCollectionByKeyWithIdMap(prevCompanyData, collection, frameworkId),
      };
    }
    default: return state;
  }
}

export default category;