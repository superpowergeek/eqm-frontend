import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const companyProductMaterial = (state = {}, action) => {
  switch (action.type) {
    case types.GET_COMPANY_PRODUCT_MATERIAL_SUCCESS: {
      const { collection, companyId } = action.data;
      return updateWithCollectionByKeyWithIdMap(state, collection, companyId);
    }
    case types.ADD_COMPANY_PRODUCT_MATERIAL_SUCCESS: {
      const { record, companyId } = action.data;
      return addNewRecordAndUpdateState(state, companyId, record);
    }
    case types.DELETE_COMPANY_PRODUCT_MATERIAL_SUCCESS: {
      const { companyId, recordId } = action.data;
      return deleteRecordAndUpdateState(state, companyId, recordId);
    }

    case types.UPDATE_COMPANY_PRODUCT_MATERIAL_SUCCESS: {
      const { companyId, recordId, data } = action.data;
      return updateRecordAndState(state, companyId, recordId, data);
    }
    default: return state;
  }
}

export default companyProductMaterial;