import moment from 'moment';
import { ascSorter } from 'utils/functions';
import { categories, chartTypes, itemsPresentMap } from '@constants';

const wasteParser = (filter, chartType) => (datas, targetItems, idsMap, isAccu = false) => {
  if (chartType === chartTypes.LINE_CHART) {
    const dataMap = {};
    let timestampKeys = [];
    datas.map(({ id, data }) => {
      if (timestampKeys.length < Object.keys(data).length) {
        timestampKeys = Object.keys(data).map(k => k);
      }
      return timestampKeys.map(timestampKey => {
        const row = data[timestampKey] || {};
        targetItems.map(itemKey => {
          const numberTimestamp = Number(timestampKey);
          const numOfValue = Number((row[itemKey] || 0).toFixed(2));
          const value = {
            y: numOfValue,
            x: moment(numberTimestamp).format('YYYY-MM-DD'),
            label: moment(numberTimestamp).format('YYYY/MM/DD'),
            timestamp: numberTimestamp,
          };
          const key = `${idsMap[id]}-${itemsPresentMap[itemKey]}`;
          if (dataMap[key]) {
            dataMap[key] = [
              ...dataMap[key],
              value,
            ];
            return null;
          }
          dataMap[key] = [value]; 
          return null;
        })
        return null;
      })
    });
    
    return {
      data: Object.entries(dataMap).map(([keyId, value]) => {
        let accu = 0;
        const sortedArray = isAccu 
          ?
          value.sort(ascSorter).map(row => {
            accu = accu + row.y;
            return {
              ...row,
              y: accu,
            };
          }) 
          :
          value.sort(ascSorter)
        return {
          id: keyId,
          data: filter(sortedArray),
        }
      }),
      keysMap: idsMap,
      xScale: 'empty',
      axisBottom: {
        // format: '%-d/%-m/%Y',
        tickRotation: 15,
        // tickValues: 'every 2 weeks',
        tickValues: 2,
        legend: 'Date',
        legendOffset: 40,
        legendPosition: 'middle'
      }
    }
  }
  
  // combind multi source of data to hashMap, use timestamp as key, sourceId as subKey
  const sourceMap = {};
  const ids = datas.map(({ id, data }) => {
    Object.entries(data).map(([timestamp, row]) => {
      if (sourceMap[timestamp]) {
        sourceMap[timestamp] = {
          ...sourceMap[timestamp],
          [id]: row,
        }
        return null;
      }
      sourceMap[timestamp] = {
        [id]: row,
      };
      return null;
    });
    return id;
  })

  // prepare empty valueObject for each row
  const valueObject = {};
  let keys = [];

  // set inital value as 0 with key of [`${sourceId}-${item}`]
  // push each key for later usage
  ids.map(id => {
    targetItems.map(itemKey => {
      const key = `${idsMap[id]}-${itemsPresentMap[itemKey]}`;
      valueObject[key] = 0;
      keys.push(key);
      return null;
    })
    return null;
  });
  

  /*
    sourceMap = {
      [timestamp1] = {
        [id1]: row,
        [id2]: row,
      },
      [timestamp2] = {
        [id1]: row,
        [id2]: row,
      }  
    }
    row = {
      sox,
      cox,
      nox, ...
    }
  */
  const simpleRows = Object.entries(sourceMap).map(([timestamp, object]) => {
    Object.entries(object).map(([sourceId, row]) => {
      targetItems.map(itemKey => {
        valueObject[`${idsMap[sourceId]}-${itemsPresentMap[itemKey]}`] = Number((row[itemKey] || 0).toFixed(2));
        return null;
      })
      return null;
    })
    return {
      timestamp: Number(timestamp),
      ...valueObject,
      x: moment(Number(timestamp)).format('YYYY/MM/DD'),
    }
  }).sort(ascSorter)
  
  if (isAccu) {
    const accuMap = {};
    const accuRows = simpleRows.map(row => {
      const { timestamp, x } = row;
      keys.forEach(k => {
        if (!accuMap[k]) {
          accuMap[k] = row[k];
        } else {
          accuMap[k] = accuMap[k] + row[k]; 
        }
      })
      return {
        timestamp,
        x,
        ...accuMap,
      }
    })
    return {
      data: filter(accuRows),
      keys,
      keysMap: idsMap,
      indexBy: "x",
    }
  }
  return {
    data: filter(simpleRows),
    keys,
    keysMap: idsMap,
    indexBy: "x",
  }
}

const pollutantParser = (filter, chartType) => (datas, targetItems, idsMap, isAccu = false) => {
  
  if (chartType === chartTypes.LINE_CHART) {
    const dataMap = {};
    let timestampKeys = [];
    datas.map(({ id, data }) => {
      if (timestampKeys.length < Object.keys(data).length) {
        timestampKeys = Object.keys(data).map(k => k);
      }
      return timestampKeys.map(timestampKey => {
        const row = data[timestampKey] || {};
        targetItems.map(itemKey => {
          const numberTimestamp = Number(timestampKey);
          const numOfValue = Number((row[itemKey] || 0).toFixed(2));
          const value = {
            y: numOfValue,
            x: moment(numberTimestamp).format('YYYY-MM-DD'),
            label: moment(numberTimestamp).format('YYYY/MM/DD'),
            timestamp: numberTimestamp,
          };
          const key = `${idsMap[id]}-${itemsPresentMap[itemKey]}`;
          if (dataMap[key]) {
            dataMap[key] = [
              ...dataMap[key],
              value,
            ];
            return null;
          }
          dataMap[key] = [value]; 
          return null;
        })
        return null;
      })
    });
    return {
      data: Object.entries(dataMap).map(([keyId, value]) => {
        let accu = 0;
        const sortedArray = isAccu 
          ?
          value.sort(ascSorter).map(row => {
            accu = accu + row.y;
            return {
              ...row,
              y: accu,
            };
          }) 
          :
          value.sort(ascSorter)
        return {
          id: keyId,
          data: filter(sortedArray),
        }
      }),
      keysMap: idsMap,
      axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 15,
        // legend: itemsUnitMap[targetItems[0]],
        legendPosition: 'middle',
        legendOffset: -50
      }
    }
  }
  // combind multi source of data to hashMap, use timestamp as key, sourceId as subKey
  const sourceMap = {};
  const ids = datas.map(({ id, data }) => {
    Object.entries(data).map(([timestamp, row]) => {
      if (sourceMap[timestamp]) {
        sourceMap[timestamp] = {
          ...sourceMap[timestamp],
          [id]: row,
        }
        return null;
      }
      sourceMap[timestamp] = {
        [id]: row,
      };
      return null;
    });
    return id;
  })

  // prepare empty valueObject for each row
  const valueObject = {};
  let keys = [];

  // set inital value as 0 with key of [`${sourceId}-${item}`]
  // push each key for later usage
  ids.map(id => {
    targetItems.map(itemKey => {
      const key = `${idsMap[id]}-${itemsPresentMap[itemKey]}`;
      valueObject[key] = 0;
      keys.push(key);
      return null;
    })
    return null;
  });
  

  /*
    sourceMap = {
      [timestamp1] = {
        [id1]: row,
        [id2]: row,
      },
      [timestamp2] = {
        [id1]: row,
        [id2]: row,
      }  
    }
    row = {
      sox,
      cox,
      nox, ...
    }
  */
  const simpleRows = Object.entries(sourceMap).map(([timestamp, object]) => {
    Object.entries(object).map(([sourceId, row]) => {
      targetItems.map(itemKey => {
        valueObject[`${idsMap[sourceId]}-${itemsPresentMap[itemKey]}`] = Number((row[itemKey] || 0).toFixed(2));
        return null;
      })
      return null;
    })
    return {
      timestamp: Number(timestamp),
      ...valueObject,
      x: moment(Number(timestamp)).format('YYYY/MM/DD'),
    }
  }).sort(ascSorter)
  
  if (isAccu) {
    const accuMap = {};
    const accuRows = simpleRows.map(row => {
      const { timestamp, x } = row;
      keys.forEach(k => {
        if (!accuMap[k]) {
          accuMap[k] = row[k];
        } else {
          accuMap[k] = accuMap[k] + row[k]; 
        }
      })
      return {
        timestamp,
        x,
        ...accuMap,
      }
    })
    return {
      data: filter(accuRows),
      keys,
      keysMap: idsMap,
      indexBy: "x",
      axisLeft: {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 15,
        // legend: itemsUnitMap[targetItems[0]],
        legendPosition: 'middle',
        legendOffset: -50,
      }
    }
  }
  
  return {
    data: filter(simpleRows),
    keys,
    keysMap: idsMap,
    indexBy: "x",
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 15,
      // legend: itemsUnitMap[targetItems[0]],
      legendPosition: 'middle',
      legendOffset: -50,
    }
  }
  
}

export default {
  [categories.WASTE]: wasteParser,
  [categories.POLLUTANTS]: pollutantParser,
}

// Normalize data structure same as pollutants
export const wastePreprocesser = (result, targetItems, source) => {
  // source could be [companyIds], [assetGroupIds], [assetIds]
  const sourceIdTimestampWasteTypeMap = {}; // obj[sourceId][timestamp][wasteType] = value same pattern with pollutants
  source.map(id => sourceIdTimestampWasteTypeMap[id] = {});
  targetItems.map((wasteType, index) => {
    const resultData = result[index].data;
    Object.entries(resultData).map(([sourceId, row]) => {
      Object.entries(row).map(([timestamp, rowValue]) => {
        if (!sourceIdTimestampWasteTypeMap[sourceId][timestamp]) return sourceIdTimestampWasteTypeMap[sourceId][timestamp] = { [wasteType]: rowValue };
        sourceIdTimestampWasteTypeMap[sourceId][timestamp] = {
          ...sourceIdTimestampWasteTypeMap[sourceId][timestamp],
          [wasteType]: rowValue,
        };
        return null
      })
      return null;
    })
    return null;
  })
  return sourceIdTimestampWasteTypeMap;
}

export const analyticDetailCreator = (reportData, sourceCategoryMap, subItems) => {
  let counter = 0;
  const rows = [];
  if (!sourceCategoryMap || !reportData) return rows;
  Object.values(sourceCategoryMap).forEach(sourceArray => {
    sourceArray.forEach(({ id, value, type }) => {
      const timeValueObject = reportData[type][id];
      Object.entries(timeValueObject).forEach(([timestamp, object], index) => {
        const row = {};
        row.timestamp = Number(timestamp);
        row.source = value;
        row.id = counter;
        subItems.forEach(itemKey => {
          row[itemKey] = Number((object[itemKey] || 0).toFixed(1));
        })
        rows.push(row);
        counter++;
      })
    })
  })
  return rows.sort(ascSorter);
}