import ChartDrawer from 'components/shared/ChartDrawer';
import AnalyticTable from 'components/shared/AnalyticTable';

export const customTypes = {
  CHART: 'CHART',
  TABLE: 'TABLE',
  DIVIDER: 'DIVIDER',
}

export const renderMap = {
  [customTypes.CHART]: ChartDrawer,
  [customTypes.TABLE]: AnalyticTable,
}

export const renderPropsCreator = (type) => ({ config, dataSet }) => {
  const { source, chart } = config || {};
  if (type === customTypes.TABLE) {
    return {
      sourceConfig: source,
      dataSet,
    }
  }
  return {
    chartConfig: chart,
    dataSet
  }
}