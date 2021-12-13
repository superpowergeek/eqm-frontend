import React from 'react';
import NivoBar from 'components/Nivo/Bar';
import NivoLine from 'components/Nivo/Line';
import NivoPie from 'components/Nivo/Pie';
import EmptyChart from 'components/shared/EmptyChart';
import { chartTypes } from '@constants';
import { parser } from 'utils/reportParser';

const ChartMap = {
  [chartTypes.BAR_CHART]: NivoBar,
  [chartTypes.LINE_CHART]: NivoLine,
  // [chartTypes.PIE_CHART]: NivoPie,
  default: NivoPie,
}

const ChartDrawer = React.memo((props) => {
  const { dateRangeFilter, chartConfig, dataSet, dataFilter, otherPropsFilter = r => r } = props;
  if (!dataSet || !chartConfig) return <EmptyChart />;
  const { chartType, xAxisMode, xAxisItems, domainItems, time } = chartConfig;
  const RenderChart = ChartMap[chartType];
  if (!RenderChart) return <EmptyChart />;

  const { data, ...others } = React.useCallback(
    parser(dateRangeFilter)(dataSet, { chartType, xAxisMode, xAxisItems, domainItems, time }),
    [dateRangeFilter, dataSet, chartType, xAxisMode, xAxisItems, domainItems, time]);
  
  if (!data) return <EmptyChart />;
  // console.log('[Render Data]', data);
  return (
    <RenderChart
      data={dataFilter ? dataFilter(data) : data}
      {...otherPropsFilter(others)}
      renderEmpty={EmptyChart}
    />
  );
});

export default ChartDrawer;