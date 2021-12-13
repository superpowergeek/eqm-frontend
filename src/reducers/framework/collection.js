import types from '@constants/actions';

const collection = (state = [], action) => {
  switch (action.type) {
    case types.GET_FRAMEWORKS_SUCCESS: {
      const { collection } = action.data;
      return collection;
    }
    default: return state;
  }
}

export default collection;