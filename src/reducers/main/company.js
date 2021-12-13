import types from '@constants/actions';
const company = (state = {}, action) => {
  switch (action.type) {
    // case types.GET_ALL_COMPANY_SUCCESS: {
    //   const { collection } = action.data;
    //   const idMap = {};
    //   const ids = collection.map(row => {
    //     idMap[row.id] = row.name;
    //     return row.id;
    //   });
    //   return {
    //     ...state,
    //     collection,
    //     ids,
    //     idMap,
    //   };
    // }
    case types.GET_COMPANY_SUCCESS: {
      const { company, children } = action.data;
      const collection = [company, ...children];
      const idMap = {};
      const ids = collection.map((row) => {
        idMap[row.id] = row;
        return row.id;
      });
      return {
        ...state,
        ids,
        idMap,
      }
    }
    default:
      return state;
  };
};

export default company;
