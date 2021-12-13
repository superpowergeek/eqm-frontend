import moment from 'moment';
import { chartTypes } from '@constants';

const lineCreater = (rows, isAccu = false) => {
  let accu = 0;
  const sortedRows = rows.map(({ timestamp, value }, index) => {
    const yValue = isAccu ? (accu = accu + value) : value;
    return ({
      timestamp,
      label: moment(timestamp).format('l'),
      mt: (value / 1000).toFixed(2),
      x: moment(timestamp).format('YYYY-MM-DD'),
      y: (yValue / 1000).toFixed(2),
      unit: 'metric tons',
    });
  }).sort((a, b) => a.timestamp - b.timestamp);
  if (sortedRows.length === 0) {
    return {
      data: [],
    }
  }
  return {
    data: [
      { id: 'Supplier A', color: 'hsl(180, 70%, 50%)', data: sortedRows },
      { id: 'Supplier B', color: 'hsl(180, 70%, 50%)', data: sortedRows },
      { id: 'Internal', color: 'hsl(180, 70%, 50%)', data: sortedRows },
    ],
  };
}

const barCreater = (rows) => {
  const sortedBarRows = rows.map(({ timestamp, value }, index) => {
    return ({
      timestamp,
      mt: (value / 1000).toFixed(2),
      x: moment(timestamp).format('MM/DD'),
      "Supplier A": parseInt((value / 1000).toFixed(2), 10),
      "Supplier B": parseInt((value / 1000 / 2).toFixed(2), 10) ,
      "Internal": parseInt((value / 1000 / 2 * 3).toFixed(2), 10),
      unit: 'metric tons',
    });
  }).sort((a, b) => a.timestamp - b.timestamp).splice(0, 6);;
  return {
    data: sortedBarRows,
    keys: ["Supplier A", "Supplier B", "Internal"],
    indexBy: "x"
  }
}

const barCreaterByFleets = (rows) => {
  const avg = (rows.reduce((accu, cur) => accu + parseInt(cur.value, 10), 0) / 100000000).toFixed(4);
  return {
    data: [{
      fleet: "FG2",
      Internal: Number((avg * 1.5).toFixed(2)),
    },{
      fleet: "FG10",
      Internal: Number((avg * 1.4).toFixed(2)),
    },{
      fleet: "FG12",
      Internal: Number((avg * 1.35).toFixed(2)),
    },{
      fleet: "FG9",
      Internal: Number((avg * 1.25).toFixed(2)),
    },{
      fleet: "FG8",
      Internal: Number((avg * 1.1).toFixed(2)),
    },{
      fleet: "FG4",
      Internal: Number((avg * 1).toFixed(2)),
    },{
      fleet: "FG6",
      Internal: Number((avg * 0.9).toFixed(2)),
    },{
      fleet: "FG15",
      Internal: Number((avg * 0.85).toFixed(2)),
    },{
      fleet: "FG2",
      Internal: Number((avg * 0.7).toFixed(2)),
    }
    ],
    keys: ["Internal"],
    indexBy: "fleet",
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Avg. Sludge/day (Cu.m)',
      legendPosition: 'middle',
      legendOffset: -50
    }
  }
}

export const fakeCreaterMap = {
  [chartTypes.LINE_CHART]: lineCreater,
  [chartTypes.BAR_CHART]: barCreater,
  default: barCreaterByFleets,
}