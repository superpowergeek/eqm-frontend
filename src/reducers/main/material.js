import types from '@constants/actions';
import { 
  updateWithCollectionByKeyWithIdMap,
  addNewRecordAndUpdateState,
  deleteRecordAndUpdateState,
  updateRecordAndState,
} from 'utils/functions';

const material = (state = [], action) => {
  switch (action.type) {
    case types.GET_MATERIAL_SUCCESS: {
      const { collection } = action.data;
      return collection.reduce((obj, material) => {
        obj[material.id] = material
        return obj
      }, {});
    }
    default: return state;
  }
}

export default material;