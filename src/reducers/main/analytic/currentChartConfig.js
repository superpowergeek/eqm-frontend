import types from '@constants/actions';
import { xAxisModes } from '@constants/chart';
/* configuration 
  id,
  chartType,
  xAxisMode: time/category/company/AssetGroup/Asset -> TODO: should be time/mixed
  xAxisItems: [], // if time just one string, array max 8 items
  domainItems: [] // choose domainItems to put in single xAxis object, limit in 5
*/
const initChartConfig = {
  xAxisMode: xAxisModes.TIME,
  xAxisItems: [],
  domainItems: [],
  time: {
    begin: null,
    end: null,
  }
}

const currentChartConfig = (state = initChartConfig, action) => {
  switch (action.type) {
    case types.ADD_ANALYTIC_REPORT_SUCCESS:
    case types.CLEAR_CURRENT_CONFIG: {
      return initChartConfig;
    }
    case types.SET_CURRENT_CONFIG: {
      const { id, chartType, ...others } = action.data;
      return {
        ...state,
        id,
        chartType,
        ...others,
      }
    }
    case types.UPDATE_CURRENT_TIME: {
      const { time } = action.data;
      return {
        ...state,
        time: {
          ...state.time,
          ...time,
        }
      }
    }
    case types.UPDATE_CURRENT_XAXIS_ITEMS_BY_ARRAY: {
      const { objectsArray } = action.data;
      return {
        ...state,
        xAxisItems: objectsArray,
      }
    }
    case types.UPDATE_CURRENT_XAXIS_ITEMS: {
      const { objectsArray } = action.data;
      return {
        ...state,
        xAxisItems: objectsArray,
      }
    }
    case types.UPDATE_CURRENT_DOMAIN_ITEMS_BY_ARRAY: {
      const { objectsArray } = action.data;
      return {
        ...state,
        domainItems: objectsArray,
      }
    }
    case types.UPDATE_CURRENT_DOMAIN_ITEMS: {
      const { domainItems } = state;
      const { object } = action.data;
      const length = domainItems.length;
      const currentIndex = domainItems.findIndex(row => row.value === object.value);
      const newItems = [...domainItems];
      if (currentIndex === -1) {
        if (length >= 5) return state;
        newItems.push(object);
      } else {
        newItems.splice(currentIndex, 1);
      }
      return {
        ...state,
        domainItems: newItems,
      }
    }
    case types.UPDATE_CURRENT_CONFIG: {
      const { data } = action;
      return {
        ...state,
        ...data,
      }
    }
    default: return state;
  }
}

export default currentChartConfig;
