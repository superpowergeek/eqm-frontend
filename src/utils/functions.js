import moment from 'moment';


export const ascSorter = (a, b) => a.timestamp - b.timestamp;

export const onInputChange = cb => e => {
  if (e.persist) e.persist();
  cb(e.target.value);
}

export const onInputBlur = validater => setIsError => (e) => {
  const { value } = e.target;
  if (!validater(value)) return setIsError(true);
}

export const onInputFocus = setIsError => (e) => {
  setIsError(false);
}

export function promiseWait(waitMillisec) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, waitMillisec);
  });
}

export const getDataFromReports = (row, sourceId, reportDatas) => {
  const { category, frequency, range } = row;
  const { beginDate, endDate } = range;
  const timestampTag = (beginDate && endDate) ? `${beginDate}-${endDate}` : 'All';
  if (!reportDatas[category]) return [];
  if (!reportDatas[category][frequency]) return [];
  if (!reportDatas[category][frequency][timestampTag]) return [];
  if (!reportDatas[category][frequency][timestampTag][sourceId]) return [];
  return reportDatas[category][frequency][timestampTag][sourceId];
}


export const createNumbersSumTen = (n) => {
  const randNums = new Array(n);
  let sum = 0;

  for (let i = 0; i < randNums.length; i++) {
    randNums[i] = Math.random();
    sum += randNums[i]
  }

  for (let i = 0; i < randNums.length; i++) {
    randNums[i] /= sum / 10;
  }

  return randNums;
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const pieDataCreater = (sourceMap = {}, idMap, item) => {
  const pieData = Object.entries(sourceMap).map(([sourceId, valueObject]) => {
    return {
      "id": idMap[sourceId],
      "label": idMap[sourceId],
      "value": Number((valueObject[item] || 0).toFixed(0)),
    };
  })
  return pieData;
}

export const updateWithCollectionByKeyWithIdMap = (state, collection, key) => {
  const idMap = {};
  const ids = collection.map((row) => {
    idMap[row.id] = row;
    return row.id;
  });
  return {
    ...state,
    [key]: {
      ids,
      idMap,
    },
  };
}

//input record
export const addNewRecordAndUpdateState = (state, key, record) => {
  // record: record to add
  const prevIdMap = (state[key] && state[key].idMap) || {};
  const prevIds = (state[key] && state[key].ids) || [];
  const ids = [...prevIds, record.id];

  return {
    ...state,
    [key]: {
      ids,
      idMap: {
        ...prevIdMap,
        [record.id]: record,
      },
    }
  }
}

//input recordId
export const deleteRecordAndUpdateState = (state, key, recordId) => {
  // id: id to delete
  const prevIdMap = (state[key] && state[key].idMap) || {};
  const prevIds = (state[key] && state[key].ids) || []; 
  delete prevIdMap[recordId];

  return {
    ...state,
    [key]: {
      ids: prevIds.filter(id => id !== recordId ),
      idMap: {
        ...prevIdMap,
      }
    }
  }
}

export const updateRecordAndState = (state, key, recordId, record) => {
  const prevIdMap = (state[key] && state[key].idMap) || {};
  const prevIds = (state[key] && state[key].ids) || [];
  const idMap = {
    ...prevIdMap,
    [recordId]: record,
  }

  return {
    ...state,
    [key]: {
      ids: [...prevIds],
      idMap,
    }
  }
}

export const updateWithSumCollectionByKeyWithIdMap = (state, collection, key, getters = {} ) => {
  const idMap = {};
  const ids = collection.map((row) => {
    idMap[row.id] = row;
    return row.id;
  });

  const { getTime, getAmount } = getters;
  const sumObject = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
    total: 0,
  };

  ids.forEach(id => {
    const row = idMap[id];
    const timestamp = getTime(row);
    const value = getAmount(row);
    sumObject[`Q${moment(timestamp).quarter()}`] = sumObject[`Q${moment(timestamp).quarter()}`] + value;
    sumObject.total = sumObject.total + value;
  });
  
  return {
    ...state,
    [key]: {
      ids,
      idMap,
      ...sumObject,
    }
  }
}

export const addNewRecordAndUpdateStateWithSum = (state, key, record, getters = {}) => {
  //record: record to add
  const { getTime, getAmount } = getters;
  const prevIdMap = (state[key] && state[key].idMap) || {};
  const prevIds = (state[key] && state[key].ids) || []; 
  const sumObject ={
    total: (state[key] && state[key].total) || 0,
    Q1: (state[key] && state[key].Q1) || 0,
    Q2: (state[key] && state[key].Q2) || 0,
    Q3: (state[key] && state[key].Q3) || 0,
    Q4: (state[key] && state[key].Q4) || 0,
  }
  
  const timestamp = Number(getTime(record));
  const value = getAmount(record);

  const ids = [...prevIds,record.id ];
  
  sumObject.total = sumObject.total + value;
  sumObject[`Q${moment(timestamp).quarter()}`] = sumObject[`Q${moment(timestamp).quarter()}`] + value;
  
  return {
    ...state,
    [key]: {
      ids,
      idMap: {
        ...prevIdMap,
        [record.id]: record,
      },

      ...sumObject,
    }
  }   
}

export const deleteRecordAndUpdateStateWithSum = (state, key, recordId, getters = {}) => {
  //recordId: record to delete
  const { getTime, getAmount } = getters;
  const prevIdMap = (state[key] && state[key].idMap) || {};
  const prevIds = (state[key] && state[key].ids) || [];
  const sumObject ={
    total: (state[key] && state[key].total) || 0,
    Q1: (state[key] && state[key].Q1) || 0,
    Q2: (state[key] && state[key].Q2) || 0,
    Q3: (state[key] && state[key].Q3) || 0,
    Q4: (state[key] && state[key].Q4) || 0,
  };
  
  const timestamp = getTime(prevIdMap[recordId]);
  const value = getAmount(prevIdMap[recordId]);

  sumObject.total = sumObject.total - value;
  sumObject[`Q${moment(timestamp).quarter()}`] = sumObject[`Q${moment(timestamp).quarter()}`] - value;
  delete prevIdMap[recordId];

  return {
    ...state,
    [key]: {
      ids: prevIds.filter(id => id !== recordId),
      idMap: {
        ...prevIdMap
      },
      ...sumObject,
    }
  }
}

export const updateStateComposer = (key, value) => (state) => {
  return {
    ...state,
    [key]: value,
  }
}
