import types from '@constants/actions';

const persistence = (state = { rememberMe: false }, action) => {
  switch (action.type) {
    case types.UPDATE_REMEMBER_ME: {
      const { value } = action.data;
      return {
        ...state,
        rememberMe: value,
      };
    }
    case types.CLEAR_SENSITIVE_DATA: 
      return {};
    default:
      return state;
  }
}

export default persistence;