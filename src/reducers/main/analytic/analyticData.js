import types from '@constants/actions';

/* 
reportData structure
{
  company: {
    [companyId]: {},
  },
  assetGroup: {
    [assetGroupId]: {}
  },
  asset: {
    [assetId]: {},
  },
}
*/

const analyticData = (state = {}, action) => {
  switch (action.type) {
    case types.CLEAR_CURRENT_CONFIG: {
      delete state.tmp;
      return {
        ...state,
      }
    }
    case types.GET_ANALYTIC_DATA_SUCCESS: {
      const { id, result } = action.data;
      return {
        ...state,
        [id]: result,
      };
    }
    case types.ADD_ANALYTIC_REPORT_SUCCESS: {
      const { report } = action.data;
      return {
        ...state,
        [report.id]: state.tmp,
      }
    }
    default: return state;
  }
}

export default analyticData;



