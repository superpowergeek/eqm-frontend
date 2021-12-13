import types from '@constants/actions';

const companyMetric = (state = {}, action) => {

  switch (action.type) {
    case types.GET_COMPANY_METRICS_SUCCESS: {
      const { collection, companyId } = action.data;
      const idMap = {};
      const metricIdMap = {};
      const ids = collection.map((row) => {
        idMap[row.id] = row;
        metricIdMap[row.metricId] = row;
        return row.id;
      });
      return {
        ...state,
        [companyId]: {
          ids,
          idMap,
          metricIdMap,
        },
      };
    }
    case types.UPDATE_COMPANY_METRIC_SUCCESS: {
      const { companyMetric, companyId } = action.data;
      const prevIdMap = state[companyId]?.idMap || {};
      const prevMetricIdMap = state[companyId]?.metricIdMap || {};
      prevIdMap[companyMetric.id] = companyMetric;
      prevMetricIdMap[companyMetric.metricId] = companyMetric;
      return {
        ...state,
        [companyId]: {
          ...state[companyId],
          idMap: { ...prevIdMap },
          metricIdMap: { ...prevMetricIdMap},
        },
      };
    }
    default: return state;
  }
}

export default companyMetric;