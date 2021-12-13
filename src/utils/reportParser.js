import moment from 'moment';
import { chartTypes } from '@constants';
import { xAxisModes } from '@constants/chart';
import { ascSorter } from 'utils/functions';

export const parser = (dateFilterFromSection = () => () => true) => (dataSet, config) => {
  const { chartType, xAxisMode, xAxisItems = [], domainItems = [], time } = config;
  console.log('[Parser Config]', config);
  const {
    begin,
    end
  } = time;

  const filterDate = (getTimestamp) => (row) => {
    let ok = true;
    if (begin && end) {
      ok = ok && moment(getTimestamp(row)).isBetween(begin, end);
    }
    return ok;
  }

  if (chartType === chartTypes.LINE_CHART) {
    switch(xAxisMode) {
      case xAxisModes.TIME: {
        if (domainItems.length === 0 || !xAxisItems[0]) return {};
        const againstItem = xAxisItems[0].value;
        const timestamps = domainItems.reduce((prev, { value, id, type }) => {
          const currKeys = Object.keys(dataSet[type][id]);
          return [...new Set(prev.concat(currKeys))]; // prevent timestamp key duplicate
        }, []).filter(filterDate(r => Number(r))).filter(dateFilterFromSection(r => Number(r)));
        const final = domainItems.map(({ id, value, type }) => {
          const sourceDataObject = dataSet[type][id];
          return {
            id: value,
            data: timestamps.map(timestamp => {
              const numberTimestamp = Number(timestamp);
              const valueObject = sourceDataObject[timestamp] || {};
              const numOfValue = Number((valueObject[againstItem] || 0).toFixed(2));
              return {
                x: moment(numberTimestamp).format('YYYY-MM-DD'),
                y: numOfValue,
                label: moment(numberTimestamp).format('YYYY/MM/DD'),
                timestamp: numberTimestamp,
              }
            }).sort(ascSorter)
          }
        })
        return {
          data: final,
        }
      }
      case xAxisModes.SOURCES: {
        const sourceSum = {};
        xAxisItems.forEach(({ id, value, type }) => {
          const sourceDataObject = dataSet[type][id];
          const totalObject = Object.entries(sourceDataObject).filter(dateFilterFromSection(([timestamp]) => timestamp)).reduce((prev, currentRow) => {
            const [, curr] = currentRow;
            domainItems.forEach(({ value: domainKey }) => {
              const prevValue = prev[domainKey] || 0;
              const currValue = curr[domainKey] || 0;
              prev[domainKey] = prevValue + currValue;
            })
            return prev;
          }, {});
          sourceSum[id] = totalObject;
        });
        const final = domainItems.map(({ value: domainKey }) => {
          return {
            id: domainKey,
            data: xAxisItems.map(({ id, value: itemKey }) => {
              return {
                x: itemKey,
                y: sourceSum[id][domainKey] || 0,
              }
            })
          }
          
        })
        return {
          data: final,
          keysMap: [],
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
      case xAxisModes.CATEGORIES: {
        const sumObject = {};
        domainItems.forEach(({ id, value: domainKey, type }) => {
          const sourceDataObject = dataSet[type][id];
          const totalObject = Object.entries(sourceDataObject).filter(dateFilterFromSection(([timestamp]) => timestamp)).reduce((prev, currentRow) => {
            const [, curr] = currentRow;
            xAxisItems.forEach(({ value: itemKey }) => {
              const prevValue = prev[itemKey] || 0;
              const currValue = curr[itemKey] || 0;
              prev[itemKey] = prevValue + currValue;
            })
            return prev;
          }, {});
          sumObject[domainKey] = totalObject;
        })

        const final = domainItems.map(({ value: domainKey }) => {
          return {
            id: domainKey,
            data: xAxisItems.map(({ value: itemKey }) => {
              return {
                x: itemKey,
                y: sumObject[domainKey][itemKey] || 0,
              }
            })
          }
        })
        return {
          data: final,
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
      default: return {};
    }
  }

  if (chartType === chartTypes.BAR_CHART) {
    switch(xAxisMode) {
      case xAxisModes.TIME: {
        if (domainItems.length === 0 || !xAxisItems[0]) return {};
        const againstItem = xAxisItems[0].value;
        const timestamps = domainItems.reduce((prev, { value, id, type }) => {
          const currKeys = Object.keys(dataSet[type][id]);
          return [...new Set(prev.concat(currKeys))]; // prevent timestamp key duplicate
        }, []).filter(filterDate(r => Number(r))).filter(dateFilterFromSection(r => Number(r)));
        const rows = timestamps.map(time => {
          const valueObject = {};
          const numberTimestamp = Number(time);
          domainItems.forEach(({ value, id, type }) => {
            const numOfValue = Number(((dataSet[type][id][time] && dataSet[type][id][time][againstItem]) || 0).toFixed(2));
            valueObject[value] = numOfValue;
          })
          return {
            x: moment(numberTimestamp).format('YYYY/MM/DD'),
            timestamp: numberTimestamp,
            ...valueObject,
          }
        }).sort(ascSorter);
        return {
          data: rows,
          keys: domainItems.map(row => row.value),
          indexBy: 'x',
        }
      }
      case xAxisModes.SOURCES: {
        const rows = xAxisItems.map(({ id, value, type }) => {
          const sourceDataObject = dataSet[type][id];
          const totalObject = Object.entries(sourceDataObject).filter(dateFilterFromSection(([timestamp]) => timestamp)).reduce((prev, currentRow) => {
            const [, curr] = currentRow;
            domainItems.forEach(({ value: eachKey }) => {
              const prevValue = prev[eachKey] || 0;
              const currValue = curr[eachKey] || 0;
              prev[eachKey] = prevValue + currValue;
            })
            return prev;
          }, {});

          return {
            x: value,
            ...totalObject,
          }
        });
        return {
          data: rows,
          keys: domainItems.map(row => row.value),
          indexBy: "x",
        }
      }
      case xAxisModes.CATEGORIES: {
        const sumObject = {};
        domainItems.forEach(({ id, value: domainKey, type }) => {
          const sourceDataObject = dataSet[type][id];
          const totalObject = Object.entries(sourceDataObject).filter(dateFilterFromSection(([timestamp]) => timestamp)).reduce((prev, currentRow) => {
            const [, curr] = currentRow;
            xAxisItems.forEach(({ value: itemKey }) => {
              const prevValue = prev[itemKey] || 0;
              const currValue = curr[itemKey] || 0;
              prev[itemKey] = prevValue + currValue;
            })
            return prev;
          }, {})
          sumObject[domainKey] = totalObject;
        })
        const rows = xAxisItems.map(({ value }) => {
          const result = {};
          domainItems.forEach(({ value: domainKey }) => {
            result[domainKey] = sumObject[domainKey][value];
          })
          return {
            x: value,
            ...result,
          }
        })
        return {
          data: rows,
          keys: domainItems.map(row => row.value),
          indexBy: "x",
        }
      }
      default: return {};
    }
  }
  
}
