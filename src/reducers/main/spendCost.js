import types from '@constants/actions';

const spendCost = (state = [], action) => {
  switch (action.type) {
    case types.GET_SPENDCOSTS_SUCCESS: {
      const { collection } = action.data;
      return collection;
    }
    default: return state;
  }
}

export default spendCost;