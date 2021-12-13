import types from '@constants/actions';

const emission = (state = [], action) => {
  switch (action.type) {
    case types.GET_EMISSIONS_SUCCESS: {
      const { collection } = action.data;
      return collection;
    }
    default: return state;
  }
}

export default emission;