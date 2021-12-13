import types from '@constants/actions';
import { updateWithCollectionByKeyWithIdMap } from 'utils/functions';

const childrenCompany = (state = {}, action) => {
  switch (action.type) {
    case types.GET_CHILDREN_COMPANY_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    default: return state;  
  }
}

export default childrenCompany;