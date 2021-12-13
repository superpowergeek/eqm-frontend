import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { categories, frequencies } from '@constants';
import types from '@constants/actions';
import moment from 'moment';

import * as Selectors from 'selectors';
import { getReportsApi, getWasteReportsApi } from './apis';
// const getSumOfResult = (result, id)=> {
//   const { pollutants, waste } = result;
//   const sum = {};
//   const pollutantItems = pollutants.data[id]; // only summary my self;
  
//   pollutantItems && Object.values(pollutantItems).map((itemValue) => {
//     Object.entries(itemValue).map(([item, value]) => {
//       if (!sum[item]) {
//         sum[item] = value;
//         return null;
//       }
//       sum[item] = sum[item] + value;
//       return null;
//     })
//     return null;
//   })
//   const wasteItems = waste.data[id];
//   wasteItems && Object.values(wasteItems).map((value) => {
//     if (!sum[categories.WASTE]) return sum[categories.WASTE] = value;
//     return sum[categories.WASTE] = sum[categories.WASTE] + value;
//   })
//   return sum;
// }

const getSumOfPollutants = (data, ids) => {
  const sum = {};
  ids.forEach(id => {
    const items = data[id];
    if (!sum[id]) sum[id] = {};
    items && Object.values(items).forEach((itemValue) => {
      Object.entries(itemValue).forEach(([item, value]) => {
        if (!sum[id][item]) return sum[id][item] = value;
        return sum[id][item] = sum[id][item] + value;
      })
    })
  })
  return sum;
};

export function* watchGetSummaryData() {
  yield takeEvery([types.GET_COMPANY_SUCCESS, types.GET_ALL_COMPANY_SUCCESS, types.GET_SUMMARY_DATA], function* foo(action) {
    try {
      const { range } = action.data;
      const companyId = yield select(Selectors.selectUserCompanyId);
      const ids = yield select(Selectors.selectCompanyIds);
      const dateRange = range || {
        beginDate: moment().subtract(1, 'years').startOf('month').format('x'),
        endDate: moment().format('x'),
      }
      const result = yield all([
        // All
        call(getReportsApi, { ids: [companyId], category: categories.POLLUTANTS, frequency: frequencies.MONTH, assign: 'all', range: dateRange }),
        // Internal Only
        call(getReportsApi, { ids: [companyId], category: categories.POLLUTANTS, frequency: frequencies.MONTH, assign: 'none', range: dateRange }), // self internal data,
        // Assign Only
        call(getReportsApi, { ids: [companyId], category: categories.POLLUTANTS, frequency: frequencies.MONTH, assign: 'assigned', range: dateRange }), // childs assigned data,
        // call(getReportsApi, ids, categories.POLLUTANTS, frequencies.MONTH, 'assigned', dateRange), // childs assigned data,
        
        // // fix summary
        // call(getReportsApi, ids, categories.POLLUTANTS, frequencies.MONTH, 'none', dateRange), // self internal data,
      ]);

      // ignore waste temp
      // const wasteTypes = [1, 2, 3];
      // const wasteResults = yield all([
      //   // All
      //   call(getWasteReportsApi, [companyId], categories.WASTE, frequencies.MONTH, 'all', dateRange, wasteTypes),
      //   // Internal Only
      //   call(getWasteReportsApi, [companyId], categories.WASTE, frequencies.MONTH, 'none', dateRange, wasteTypes), // self internal data,
      //   // Assign Only
      //   call(getWasteReportsApi, ids, categories.WASTE, frequencies.MONTH, 'assigned', dateRange, wasteTypes), // childs assigned data,
      // ])
      
      // const totalSum = getSumOfResult({ pollutants: allPollutants, waste: allWaste }, companyId);
      // const assignedSums = childrenIds.map(id => 
      //   ({ 
      //     assignedId: id,
      //     sum: getSumOfResult({ pollutants: childrenPollutants, waste: childrenWaste }, id)
      //   }));
      const allPollutants = result[0].data;
      const total = getSumOfPollutants(allPollutants, [companyId]);
      const internalPollutants = result[1].data;
      const internal = getSumOfPollutants(internalPollutants, [companyId]);
      const suppliersPollutants = result[2].data;
      const suppliers = getSumOfPollutants(suppliersPollutants, ids);
      const sources = { ...suppliers, ...internal };
      yield put({ type: types.GET_SUMMARY_DATA_SUCCESS, data: {
        [categories.POLLUTANTS]: {
          total: total[companyId],
          sources,
        }
      }});
    } catch (e) {
      console.warn('GET_SUMMARY_DATA_ERROR', e);
      yield put({ type: types.GET_SUMMARY_DATA_ERROR, error: e });
    }
    
  })
}

export default function* summaryRoot() {
  yield all([
    call(watchGetSummaryData),
  ])
}