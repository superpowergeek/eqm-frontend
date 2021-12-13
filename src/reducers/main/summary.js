import types from '@constants/actions';

const summary = (state = {}, action) => {
  switch (action.type) {
    case types.GET_SUMMARY_DATA_SUCCESS: {
      return {
        ...state,
        ...action.data,
      }
    }
    default:
      return state;
  }
}

export default summary;
