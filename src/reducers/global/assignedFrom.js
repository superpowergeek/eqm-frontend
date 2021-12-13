// get all [assigned from] others records
import types from '@constants/actions';
import { updateWithCollectionByKeyWithIdMap } from 'utils/functions';
/*
  state: {
    [companyId]: {
      [type]: {
        ids,
        idMap,
      }
    }
  }
*/

const assignedFrom = (state = {}, action) => {
  switch (action.type) {
    case types.GET_ASSIGNED_FROM_RECORDS_SUCCESS: {
      const { collection, companyId, type } = action.data;
      const prevCompanyData = state[companyId] || {};
      return {
        ...state,
        [companyId]:updateWithCollectionByKeyWithIdMap(prevCompanyData, collection, type),
      };
    }
    default: return state;
  }
}

export default assignedFrom;

