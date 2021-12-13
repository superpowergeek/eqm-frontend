import types from '@constants/actions';


/* report data structure 
  {
    ids: [],
    idMap: {
      [reportId]: reportRowData,
    }
  }
*/
const reportRecord = (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case types.GET_USER_REPORTS_SUCCESS: {
      const { collection } = action.data;
      const idMap = {};
      const ids = collection.map(row => {
        idMap[row.id] = row;
        return row.id;
      });
      return {
        ids,
        idMap,
      }
    }
    case types.GET_SINGLE_USER_REPORT_SUCCESS: {
      const { report } = action.data;
      const prevIdMap = state.idMap;
      report.content = JSON.parse(report.content);
      prevIdMap[report.id] = report;
      return {
        ...state,
        idMap: [ ...prevIdMap],
      }
    }
    case types.ADD_USER_REPORT_SUCCESS: {
      const { report } = action.data;
      const prevIds = state.ids || [];
      const prevIdMap = state.idMap || {};
      report.content = JSON.parse(report.content || '{}');
      return {
        ids: [...prevIds, report.id],
        idMap: {
          ...prevIdMap,
          [report.id]: report,
        }
      }
    }
    case types.DELETE_USER_REPORT_SUCCESS: {
      const prevIds = state.ids;
      const prevIdMap = state.idMap;
      const { itemIds } = action.data;
      itemIds.forEach((id) => {
        const index = prevIds.indexOf(id);
        if (index !== -1) {
          prevIds.splice(index, 1);
          delete prevIdMap[id];
        }
      });
      return {
        ids: [...prevIds],
        idMap: {...prevIdMap},
      }
    }
    case types.UPDATE_USER_REPORT_SUCCESS: {
      const  { report } = action.data;
      report.content = JSON.parse(report.content);
      return {
        ids: [ ...state.ids ],
        idMap: {
          ...state.idMap,
          [report.id]: report,
        }
      }
    }
    default:
      return state;
  }
}

export default reportRecord;