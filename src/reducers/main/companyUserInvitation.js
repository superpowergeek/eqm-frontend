import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const companyUserInvitation = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_USER_INVITATIONS_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_COMPANY_USER_INVITATION_SUCCESS: {
      const { userInvitation, companyId } = action.data;
      return addNewRecordAndUpdateState(state, companyId, userInvitation);
    }
    case types.DELETE_COMPANY_USER_INVITATION_SUCCESS: {
      const { itemIds, companyId } = action.data;
      const originIds = state[companyId]?.ids || [];
      const originIdMap = state[companyId]?.idMap || {};
      
      itemIds.forEach((id) => {
        const index = originIds.indexOf(id);
        if (index !== -1) {
          originIds.splice(index, 1);
          delete originIdMap[id];
        }
      });
      return {
        ...state,
        [companyId]: {
          ids: [...originIds],
          idMap: {...originIdMap},
        }
      }
    }
    default: return state;
  }

}

export default companyUserInvitation;
