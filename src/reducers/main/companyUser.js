import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const companyUser = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_USERS_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_COMPANY_USER_SUCCESS: {
      const { user, companyId } = action.data;
      return addNewRecordAndUpdateState(state, companyId, user);
    }
    case types.UPDATE_COMPANY_USER_SUCCESS: {
      const { userId, user, companyId } = action.data;
      return updateRecordAndState(state, companyId, userId, user); 
    }
    case types.DELETE_COMPANY_USER_SUCCESS: {
      const { userId, companyId} = action.data;
      return deleteRecordAndUpdateState(state, companyId, userId);
    }
    default: return state;
  }

}

export default companyUser