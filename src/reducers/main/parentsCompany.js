import types from '@constants/actions';
import { updateWithCollectionByKeyWithIdMap } from 'utils/functions';

const parentsCompany = (state = {}, action) => {
  switch (action.type) {
    case types.GET_PARENTS_COMPANY_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    default: return state;
  }
}

export default parentsCompany;
