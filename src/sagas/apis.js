import moment from 'moment';
import RequestApi from 'utils/RequestApi';
import { categories, assignableTypes } from '@constants';

const shareBegin = moment().subtract(1, 'years').startOf('month').format('x');
const shareEnd = moment().format('x');

export const authApi = (email, password) => {
  return RequestApi({ // auth user
    url: '/authenticate',
    method: 'post',
    data: {
      username: email,
      password: password,
    }
  });
}

export const signUpApi = (email, password) => {
  return RequestApi({ // regist user
    url: '/register',
    method: 'post',
    data: {
      username: email,
      password: password,
    }
  });
}

export const forgotPassword = (email) => { 
  return RequestApi({
    url: `/user/requestForgotPassword/${email}`,
    method: 'get'
  });
}

export const resetPassword = (payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url: '/user/completeForgotPassword',
    method: 'post',
    data,
  })
}

export const getUserReport = (reportId) => {
  return RequestApi({
    url: `/user/report/${reportId}`,
    method: 'get',
  })
}

export const getUserReports = (userId) => {
  return RequestApi({
    url: '/user/report',
    method: 'get',
    params: {
      userId,
    }
  })
}

export const deleteUserReport = (userReportId) => {
  return RequestApi({
    url: `/user/report/${userReportId}`,
    method: 'delete',
  })
}

export const addUserReport = (payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url: '/user/report',
    method: 'post',
    data,
  })
}

export const updateUserReport = (userReportId, payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url: `/user/report/${userReportId}`,
    method: 'post',
    data,
  })
}

export const postCompanyApi = (data) => {
  const payload = new FormData();
  const { 
    companyDomain,
    companyName,
    role,
    headCount,
    name,
  } = data;
  payload.set('name', companyName);
  payload.set('employees', headCount);
  payload.set('industryType', 1);
  return RequestApi({ // regist user
    url: '/company',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data' },
    data: payload,
  });
}

export const addCompanyImage = (payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url: '/company/image',
    method: 'post',
    data,
  })
}

export const getAllCompanyApi = () => {
  return RequestApi({
    url: '/company',
    method: 'get',
  });
}

export const getCompanyApi = (id) => {
  return RequestApi({
    url: `/company/${id}`,
    method: 'get',
  });
}

export const getEngines = () => {
  return RequestApi({
    url: '/assetengine/engines',
    method: 'get',
  });
}

export const getFuels = () => {
  return RequestApi({
    url: '/assetengine/fuels',
    method: 'get',
  });
}

export const getSpendCosts = () => {
  return RequestApi({
    url: '/spendcost',
    method: 'get',
  });
}

export const getEmissions = () => {
  return RequestApi({
    url: '/leasedasset/emission',
    method: 'get',
  });
}

export const getChildrenCompanyApi = (id) => {
  return RequestApi({
    url: `/company/${id}/children`,
    method: 'get',
  })
}

export const getParentsCompanyApi = (id) => {
  return RequestApi({
    url: `/company/${id}/parents`,
    method: 'get',
  })
}

export const getReportsByAssetIds = ({ ids, wasteType, assets = [], category, frequency, assign = 'all', range, scope = [1, 2, 3]}) => {
  const { beginDate, endDate } = range;
  const dateSearch = (
    beginDate && endDate &&
    `time>${beginDate} and time<${endDate}`) || `time>${shareBegin} and time<${shareEnd}`;
  const assetSearch = assets.reduce((prev, curr) => prev ? `${prev} OR asset.id:${curr}` : `asset.id:${curr}`, undefined);
  const url = `/report/${category}`;
  if (category === categories.WASTE) {
    return RequestApi({
      url,
      method: 'post',
      data: {
        timeframe: frequency,
        search: `${assetSearch} AND ${dateSearch}`,
        fetch: assign,
        type: wasteType,
        companyIds: ids,
        scope,
        grouping: 'asset',
      }
    })
  }

  return RequestApi({
    url,
    method: 'post',
    data: {
      timeframe: frequency,
      search: `${assetSearch} AND ${dateSearch}`,
      fetch: assign,
      type: 0,
      companyIds: ids,
      scope,
      grouping: 'asset',
    }
  })
}

export const getReportsByGroupIds = ({ ids, wasteType, assetGroups = [], category, frequency, assign = 'all', range, scope = [1, 2, 3]}) => {
  const { beginDate, endDate } = range;
  const dateSearch = (
    beginDate && endDate &&
    `time>${beginDate} and time<${endDate}`) || `time>${shareBegin} and time<${shareEnd}`;
  const groupSearch = assetGroups.reduce((prev, curr) => prev ? `${prev} OR asset.fleet.id:${curr}` : `asset.fleet.id:${curr}`, undefined);
  const url = `/report/${category}`;
  if (category === categories.WASTE) {
    return RequestApi({
      url,
      method: 'post',
      data: {
        timeframe: frequency,
        search: `${groupSearch} AND ${dateSearch}`,
        fetch: assign,
        type: wasteType,
        companyIds: ids,
        scope,
        grouping: 'fleet',
      }
    })
  }

  return RequestApi({
    url,
    method: 'post',
    data: {
      timeframe: frequency,
      search: `${groupSearch} AND ${dateSearch}`,
      fetch: assign,
      type: 0,
      companyIds: ids,
      scope,
      grouping: 'fleet',
    }
  })
}
// assign enum('all', 'only', 'none', 'assigned');
// all - everything 
// none - no assigned data
// only - only assigned data
// assigned = get all source with assigned data - [ids]

// report type: Pollutants: 0 = all, 1 = fuel, 2 = utilities, 3 = Personnel travel
export const getReportsApi = ({ ids, category, frequency, assign = 'all', range = {}, wasteType, scope = [1, 2, 3] }) => {
  // new version of reports (type would be socpe3 categories, only pollutants);
  const { beginDate, endDate } = range;
  const dateSearch = (
    beginDate && endDate &&
    `time>${beginDate} and time<${endDate}`) || `time>${shareBegin} and time<${shareEnd}`;
  const url = `/report/${category}`;
  
  if (category === categories.WASTE) {
    return RequestApi({
      url,
      method: 'post',
      data: {
        timeframe: frequency,
        search: dateSearch,
        fetch: assign,
        type: wasteType,
        companyIds: ids,
        scope,
      }
    })
  }
  return RequestApi({
    url,
    method: 'post',
    data: {
      timeframe: frequency,
      search: dateSearch,
      fetch: assign,
      type: 0,
      companyIds: ids,
      scope,
    }
  })
}

export const getWasteReportsApi = ({ ids, category, frequency, assign = 'all', range = {}, wasteTypes, scope = [1, 2, 3] }) => {
  const { beginDate, endDate } = range;
  const dateSearch = (
    beginDate && endDate &&
    `time>${beginDate} and time<${endDate}`) || `time>${shareBegin} and time<${shareEnd}`;
  const url = `/report/${category}`;
  const typeSearch = wasteTypes.reduce((accu, curr, index) => (index !== wasteTypes.length - 1 ? accu + `type:${curr} OR ` : accu + `type:${curr}`), '');
  return RequestApi({
    url,
    method: 'post',
    data: {
      timeframe: frequency,
      fetch: assign,
      companyIds: ids,
      search: `${typeSearch} AND ${dateSearch}`,
      type: 0, // might useless in waste report
      scope,
    }
  })
}

export const getAssetGroupsApi = (companyId) => {
  const url = '/fleet';
  return RequestApi({
    url,
    method: 'get',
    params: {
      companyId,
    }
  })
}

export const getAssetsApi = (fleetId) => {
  const url = '/asset';
  return RequestApi({
    url,
    method: 'get',
    params: {
      fleetId,
    }
  })
}

export const addAssetApi = (payload) => {
  const url = '/asset';
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteAssetApi = () => {
  const url = '/asset';
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const updateAssetApi = (assetId, payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url: `/asset/${assetId}`,
    method: 'post',
    data,
  })
}

export const addLeaseAssetApi = (payload) => {
  const url = '/leasedasset';
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const updateLeaseAssetApi = (leasedAssetId, payload) => {
  const url = `/leasedasset/${leasedAssetId}`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const addAssetGroupApi = (payload) => {
  const url = '/fleet';
  const data = new FormData();
  Object.keys(payload).forEach(key =>{
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteAssetGroupApi = () => {
  const url = '/fleet';
  return RequestApi({
    url,
    method: 'delete',
  })
} 

export const updateAssetGroupApi = (assetGroupId, payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url: `/fleet/${assetGroupId}`,
    method: 'post',
    data,
  })
}

export const addAssetWaste = (payload) => {
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url: '/waste',
    method: 'post',
    data,
  })
}

export const addAssetFuelConsumption = (payload) => {
  const data = new FormData();
  const url = '/assetfuelconsumption';
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  }) 
}

export const addAssetUtility = (payload) => {
  const url = '/assetutility';
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  }) 
}

export const addAssetRefrigeratorConsumption = (payload) => {
  const data = new FormData();
  const url = '/assetrefrigeratorconsumption';
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteAssetUtility = (rowId) => {
  const url = `/assetutility/${rowId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const deleteAssetFuelConsumption = (rowId) => {
  const url = `/assetfuelconsumption/${rowId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const deleteAssetWaste = (rowId) => {
  const url = `/waste/${rowId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const deleteAssetRefrigeratorConsumption = (rowId) => {
  const url = `/assetrefrigeratorconsumption/${rowId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const getCompanyTravelApi = () => {
  return RequestApi({
    url: '/travel',
    method: 'get',
  })
}

export const addCompanyTravelApi = (payload) => {
  return RequestApi({
    url: '/travel',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyTravelApi = (rowId) => {
  return RequestApi({
    url: `/travel/${rowId}`,
    method: 'delete',
  })
}

export const getCompanyPurchasesApi = () => {
  return RequestApi({
    url: '/purchase',
    method: 'get',
  })
}

export const addCompanyPurchasesApi = (payload) => {
  return RequestApi({
    url: '/purchase',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyPurchasesApi = (rowId) => {
  return RequestApi({
    url: `/purchase/${rowId}`,
    method: 'delete',
  })
}

export const getCompanyCommuteApi = (companyId) => {
  return RequestApi({
    url: '/commute/search',
    method: 'get',
    params: {
      companyId: companyId,
    }
  })
}

export const updateCompanyPurchasesApi = (purchaseId, payload) => {
  return RequestApi({
    url: `/purchase/${purchaseId}`,
    method: 'post',
    data: payload,
  })
}

export const updateCompanyCommuteApi = (groupId, payload) => {
  return RequestApi({
    url: `/commute/${groupId}`,
    method: 'post',
    data: payload,
  })
}

export const addCompanyCommuteApi = (payload) => {
  return RequestApi({
    url: '/commute',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyCommuteApi = (rowId) => {
  return RequestApi({
    url: `/commute/${rowId}`,
    method: 'delete',
  })
}

export const getCompanyProductApi = (companyId) => {
  return RequestApi({
    url: '/product/search',
    method: 'get',
    params: {
      companyId: companyId,
    }
  })
}

export const updateCompanyProductApi = (productId, payload) => {
  return RequestApi({
    url: `/product/${productId}`,
    method: 'post',
    data: payload,
  })
}

export const addCompanyProductApi = (payload) => {
  return RequestApi({
    url: '/product',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyProductApi = (rowId) => {
  return RequestApi({
    url: `/product/${rowId}`,
    method: 'delete',
  })
}

export const addCompanyProductMaterialApi = (productId, payload) => {
  return RequestApi({
    url: `/product/${productId}/material`,
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyProductMaterialApi = (productId, rowId) => {
  return RequestApi({
    url: `/product/${productId}/material/${rowId}`,
    method: 'delete',
  })
}

export const getMaterialApi = () => {
  return RequestApi({
    url: `/material`,
    method: 'get',
  })
}

export const getCompanySoldProductApi = (companyId) => {
  return RequestApi({
    url: '/soldproduct',
    method: 'get',
    params: {
      companyId: companyId,
    }
  })
}

export const updateCompanySoldProductApi = (soldProductId, payload) => {
  return RequestApi({
    url: `/soldproduct/${soldProductId}`,
    method: 'post',
    data: payload,
  })
}

export const addCompanySoldProductApi = (payload) => {
  return RequestApi({
    url: '/soldproduct',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanySoldProductApi = (rowId) => {
  return RequestApi({
    url: `/soldproduct/${rowId}`,
    method: 'delete',
  })
}

export const getCompanyUtilityApi = (companyId) => {
  return RequestApi({
    url: '/companycountryutility/search',
    method: 'get',
    params: {
      companyId: companyId,
    }
  })
}

export const updateCompanyUtilityApi = (id, payload) => {
  return RequestApi({
    url: `/companycountryutility/${id}`,
    method: 'post',
    data: payload,
  })
}

export const addCompanyUtilityApi = (payload) => {
  return RequestApi({
    url: '/companycountryutility',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyUtilityApi = (rowId) => {
  return RequestApi({
    url: `/companycountryutility/${rowId}`,
    method: 'delete',
  })
}

export const getCompanyWasteApi = (companyId) => {
  return RequestApi({
    url: '/companycountrywaste/search',
    method: 'get',
    params: {
      companyId: companyId,
    }
  })
}

export const updateCompanyWasteApi = (id, payload) => {
  return RequestApi({
    url: `/companycountrywaste/${id}`,
    method: 'post',
    data: payload,
  })
}

export const addCompanyWasteApi = (payload) => {
  return RequestApi({
    url: '/companycountrywaste',
    method: 'post',
    data: payload,
  })
}

export const deleteCompanyWasteApi = (rowId) => {
  return RequestApi({
    url: `/companycountrywaste/${rowId}`,
    method: 'delete',
  })
}

export const getCompanyEmployeeApi = () => {
  return RequestApi({
    url: '/company/employeecount/search',
    method: 'get'
  })
}

export const updateCompanyEmployeeApi = (id, payload) => {
  const url = `/company/employeecount/${id}`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const addCompanyEmployeeApi = (payload) => {
  const url = `/company/employeecount`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteCompanyEmployeeApi = (rowId) => {
  return RequestApi({
    url: `/company/employeecount/${rowId}`,
    method: 'delete',
  })
}

export const addAssetEngineApi = (payload) => {
  const url = `/assetengine`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteAssetEngineApi = (rowId) => {
  return RequestApi({
    url: `/assetengine/${rowId}`,
    method: 'delete',
  })
}

export const getAssetEngines = (assetId) => {
  return RequestApi({
    url: '/assetengine',
    method: 'get',
    params: {
      assetId,
    }
  })
}


export const addAssetRefrigeratorApi = (payload) => {
  const url = `/assetrefrigerator`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  });
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteAssetRefrigeratorApi = (rowId) => {
  return RequestApi({
    url: `/assetrefrigerator/${rowId}`,
    method: 'delete',
  })
}

export const getAssetRefrigerators = (assetId) => {
  return RequestApi({
    url: '/assetrefrigerator',
    method: 'get',
    params: {
      assetId,
    }
  })
}

export const getAssetEngineAvailFuels = (assetEngineId) => {
  return RequestApi({
    url: `/assetengine/${assetEngineId}/availableFuelTypes`,
    method: 'get',
  })
}

export const getFuelConsumptionsByAsset = (assetId) => {
  const url = '/assetfuelconsumption/search';
  return RequestApi({
    url,
    method: 'get',
    params: {
      search: `assetEngine.asset.id:${assetId}`
    }
  })
}

export const getUntilitesByAsset = (assetId) => {
  const url = '/assetutility/search';
  return RequestApi({
    url,
    method: 'get',
    params: {
      search: `asset.id:${assetId}`
    }
  })
}

export const getWastesByAsset = (assetId) => {
  const url = '/waste/search';
  return RequestApi({
    url,
    method: 'get',
    params: {
      search: `asset.id:${assetId}`,
    }
  })
}

export const getAssetRefrigeratorConsumptionsByAsset = (assetId) => {
  const url = '/assetrefrigeratorconsumption/search';
  return RequestApi({
    url,
    method: 'get',
    params: {
      search: `assetRefrigerator.asset.id:${assetId}`,
    }
  })
}

// export const getAssignFuelConsumptionById = (fuelConsumptionId) => {
//   const url = `/assignedfuelconsumption/${fuelConsumptionId}`;
//   return RequestApi({
//     url,
//     method: 'get',
//   })
// }

export const getAssignRecordsWithTypeAndId = (type, id) => {
  let url = `/assigned${type.toLowerCase()}`;
  const key = `${type.replace(/^.{1}/g, type[0].toLowerCase())}Id`;
  return RequestApi({
    url,
    method: 'get',
    params: {
      [key]: id,
    },
  })
}

export const addAssignRecordWithTypeAndId = (payload, type, id) => {
  let url = `/assigned${type.toLowerCase()}`;
  if (type === assignableTypes.FUEL_CONSUMPTION) {
    return RequestApi({
      url,
      method: 'post',
      params: {
        consumptionId: id,
        ...payload,
      },
    })
  }
  if (type === assignableTypes.UTILITY) {
    return RequestApi({
      url,
      method: 'post',
      params: {
        utilityId: id,
        ...payload,
      },
    })
  }
  const key = `${type.replace(/^.{1}/g, type[0].toLowerCase())}Id`;
  return RequestApi({
    url,
    method: 'post',
    params: {
      [key]: id,
      ...payload,
    },
  })
}

export const updateAssignRecordWithTypeAndId = (payload, type, id, recordId) => {
 let url = `/assigned${type.toLowerCase()}/${id}`;
 const { percent } = payload;
 return RequestApi({
  url,
  method: 'post',
  params: {
    percent,
    assignedId: recordId,
  },
})
}

export const deleteAssignRecordWithTypeAndId = (type, recordId) => {
  let url = `/assigned${type.toLowerCase()}/${recordId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

// get all data assigned to others (assignedTo)
// localhost:8090/assignedfuelconsumption/search?search=consumption.id>0
export const getAllAssignedToRecords = (companyId, type) => {
  // no need to pass companyId, will verify by token,
  const typeLowerCase = type.toLowerCase();
  let url = `/assigned${typeLowerCase}/search`;
  if (type === assignableTypes.FUEL_CONSUMPTION) {
    return RequestApi({
      url,
      method: 'get',
      params: {
        search: 'consumption.id>0',
      },
    })
  }
  return RequestApi({
    url,
    method: 'get',
    params: {
      search: `${typeLowerCase}.id>0`,
    }
  })
}


// get all data assigned to me (assignedFrom)
// localhost:8090/assignedfuelconsumption/company?companyId=1
export const getAllAssignedFromRecords = (companyId, type) => {
  const typeLowerCase = type.toLowerCase();
  let url = `/assigned${typeLowerCase}/company`;
  return RequestApi({
    url,
    method: 'get',
    params: {
      companyId,
    },
  })
}

export const getEnginesByAssetId = (assetId) => {
  const url = `/assetengine`
  return RequestApi({
    url,
    method: 'get',
    params: {
      assetId,
    }
  })
}

export const addAnalyticReport = (payload) => {
  const url = '/user/chart';
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })  
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const getUserAnalyticReports = (userId) => {
  const url = '/user/chart';
  return RequestApi({
    url,
    method: 'get',
    params: {
      userId,
    }
  })
}

export const deleteAnalyticReport = (chartId) => {
  const url = `/user/chart/${chartId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const updateUserAnalyticReport = (chartId, payload) => {
  const url = `/user/chart/${chartId}`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const getCompanyMetrics = (companyId, { beginDate, endDate}) => {
  const url = `/company/metric`;
  return RequestApi({
    url,
    method: 'get',
    params: {
      companyId,
      startTime: beginDate,
      endTime: endDate,
    }
  })
}

export const getCompanyMetricsCalculated = (companyId, { frameworkId, beginDate, endDate }) => {
  const url = `/company/metric/calculated`;
  return RequestApi({
    url,
    method: 'get',
    params: {
      companyId,
      frameworkId,
      startTime: beginDate,
      endTime: endDate,
    }
  })
}

export const addCompanyMetric = (payload) => {
  const url = `/company/metric`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const updateCompanyMetric = (companyMetricId, payload) => {
  const url = `/company/metric/${companyMetricId}`;
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url,
    method: 'post',
    data,
  })
};

export const getFrameworks = (companyId) => {
  const url = `/framework?companyId=${companyId}`;
  return RequestApi({
    url,
    method: 'get',
  }) 
}

export const getFrameworkCategories = ({ companyId, frameworkId }) => {
  const url = `/framework/category?companyId=${companyId}&frameworkId=${frameworkId}`;
  return RequestApi({
    url,
    method: 'get',
  })
}

export const getCompanyUsers = (companyId) => {
  const url = `/user`;
  return RequestApi({
    url,
    method: 'get',
    params: {
      companyId,
    }
  })
}

export const addCompanyUserInvitation = (payload) => {
  const url = '/invitation';
  const data = new FormData();
  Object.keys(payload).forEach(key => {
    data.set(key, payload[key]);
  })
  return RequestApi({
    url,
    method: 'post',
    data,
  })
}

export const deleteCompanyUserInvitation = (invitationId) => {
  const url = `/invitation/${invitationId}`;
  return RequestApi({
    url,
    method: 'delete',
  })
}

export const getCompanyUserInvitations = (companyId) => {
  const url = '/invitation';
  return RequestApi({
    url,
    method: 'get',
    params: {
      companyId,
    }
  })
}