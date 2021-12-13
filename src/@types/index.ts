export interface Chart {
  key: string,
  chartType: string,
  location: {
    x: number | string,
    y: number | string,
  },
  size: {
    w: number | string,
    h: number | string,
  },
  time?: string,
  name?: string,
  dataSets?: any;
  tickType?: any;
}