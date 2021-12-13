import types from '@constants/actions';

const session = (state = null , action) => {
  switch (action.type) {
    case types.UPDATE_USER_SUCCESS:
    case types.GET_USER_SUCCESS:
    case types.AUTH_USER_SUCCESS: {
      const { user } = action.data;
      const { dashboard } = user;
      if (!dashboard) {
        return {
          ...state,
          ...action.data,
        };
      }
      return {
        ...state,
        ...action.data,
        user: {
          ...user,
          dashboard: JSON.parse(dashboard), // charts array
        }
      };
    }
    case types.CLEAR_SENSITIVE_DATA: 
      return null;
    default:
      return state;
  }
}

export default session;
