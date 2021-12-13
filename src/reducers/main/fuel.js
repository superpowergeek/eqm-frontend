import types from '@constants/actions';

const fuel = (state = [], action) => {
  switch (action.type) {
    case types.GET_FUELS_SUCCESS: {
      const { collection } = action.data;
      return collection;
    }
    default: return state;
  }
}

export default fuel;