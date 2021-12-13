import types from '@constants/actions';

const error = (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case types.CLEAR_ERROR_RESPONSE:
      return {}
    case types.GET_SUMMARY_DATA:
    case types.GET_USER_REPORTS:
    case types.AUTH_USER: 
    case types.REGIST_USER: 
    case types.UPDATE_USER:
    case types.GET_ALL_COMPANY:
    case types.GET_COMPANY:
    case types.POST_COMPANY: {
      return {
        ...state,
        [`${type}_ERROR`]: null,
      }
    }
    case types.GET_SUMMARY_DATA_ERROR:
    case types.GET_USER_REPORTS_ERROR:
    case types.GET_COMPANY_ERROR:
    case types.GET_ALL_COMPANY_ERROR:
    case types.POST_COMPANY_ERROR: 
    case types.AUTH_USER_ERROR: 
    case types.REGIST_USER_ERROR: 
    case types.UPDATE_USER_ERROR: {
      const { message } = action.error;
      return {
        ...state,
        [type]: {
          message,
        }
      }
    }
    default:
      return state;
  }
}

export default error;
