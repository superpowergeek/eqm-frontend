import types from '@constants/actions';

const engine = (state = [], action) => {
  switch (action.type) {
    case types.GET_ENGINES_SUCCESS: {
      const { collection } = action.data;
      return collection;
    }
    default: return state;
  }
}

export default engine;