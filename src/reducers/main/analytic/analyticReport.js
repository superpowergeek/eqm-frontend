import types from '@constants/actions';

/*
  each Report Row Data
  id,
  title,
  description,
  content: '',
*/
/*
  config: {
    source: {
      range: {
        beginDate,
        endDate,
      },
      frequency,
      sourceCategoryMap,
      categoryMap,
      subItems
    }
    chart: {
      chartType,
      xAxisMode: enum(time, category, source),
      xAxisItems: [],
      domainItems: [],
      // location: {
      //   x,
      //   y,
      // }
      // size: {
      //   w,
      //   h,
      // }
    },
  }
*/
/*
{
  ids: [],
  idMap: {
    [reportId]: reportRowData,
  }
}

*/
const analyticReport = (state = { ids: [], idMap: {} }, action) => {
  switch (action.type) {
    case types.DELETE_ANALYTIC_REPORT_SUCCESS: {
      const originIds = state.ids;
      const originIdMap = state.idMap;
      const { itemIds } = action.data;
      itemIds.forEach((id) => {
        const index = originIds.indexOf(id);
        if (index !== -1) {
          originIds.splice(index, 1);
          delete originIdMap[id];
        }
      });
      return {
        ids: [...originIds],
        idMap: {...originIdMap},
      }
    }
    case types.GET_ANALYTIC_REPORTS_SUCCESS: {
      const { collection } = action.data;
      const idMap = {};
      const ids = collection.map(row => {
        row.config = JSON.parse(row.content);
        delete row.content;
        idMap[row.id] = row;
        return row.id;
      });
      return {
        ids,
        idMap,
      }
    }
    case types.ADD_TMP_ANALYTIC_REPORT: {
      const { id, config } = action.data;
      return {
        ids: [...state.ids, id],
        idMap: {
          ...state.idMap,
          [id]: {
            config,
          },
        }
      }
    }
    case types.CLEAR_CURRENT_CONFIG: {
      delete state.idMap.tmp;
      return {
        ids: state.ids.filter(id => id !== 'tmp'),
        idMap: {
          ...state.idMap,
        }
      };
    }
    case types.ADD_ANALYTIC_REPORT_SUCCESS: {
      const { report } = action.data;
      report.config = JSON.parse(report.content);
      delete state.idMap.tmp;
      return {
        ids: [ ...state.ids.filter(id => id !== 'tmp'), report.id],
        idMap: {
          ...state.idMap,
          [report.id]: report,
        }
      };
    }
    case types.UPDATE_ANALYTIC_REPORT_SUCCESS: {
      const  { report } = action.data;
      report.config = JSON.parse(report.content);
      return {
        ids: [ ...state.ids ],
        idMap: {
          ...state.idMap,
          [report.id]: report,
        }
      }
    }
    default: return state;
  }
}

export default analyticReport;