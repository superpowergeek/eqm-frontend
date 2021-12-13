import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { TableTooltip, Chip } from '@nivo/tooltip'
// import { linearGradientDef } from '@nivo/core';

const checkDataEmpty = (data) => {
  let flag = true;
  if (data.length === 0) return flag;
  data.forEach(each => {
    if (each.data.length !== 0) flag = false;
  })
  return flag
}

const NivoLine = ({ data = [], keysMap = {}, renderEmpty: RenderEmpty, axisBottom, xScale, axisLeft }) => {
  if (checkDataEmpty(data)) return <RenderEmpty />
  return(
    <ResponsiveLine
      lineWidth={1.5}
      data={data}
      min={0}
      // height={329}
      enableSlices={"x"}
      sliceTooltip={({ slice, axis }) => {
        const otherAxis = axis === 'x' ? 'y' : 'x';
        return (
          <React.Fragment>
            <TableTooltip
              rows={[
                [<strong key="label">{slice.points[0].data.label}</strong>],
                ...slice.points.map(point => [
                  <Chip key="chip" color={point.serieColor} />,
                  <div>{point.serieId}</div>,
                  <strong key="value">{point.data[`${otherAxis}Formatted`].toFixed(1)}</strong>,
                ])
              ]}
            />
          </React.Fragment>
        )
      }}
      // enablePoints={false}
      enableGridY={false}
      enableArea={false}
      areaBaselineValue={0}
      // colors={
      //   ['rgb(246, 106, 107)', 'rgb(43, 184, 225)', 'rgb(42, 55, 70)']
      // }
      // theme={{
      //   grid: {
      //     line: {
      //       stroke: "pink",
      //       strokeWidth: 1,
      //       strokeDasharray: "4 4"
      //     }
      //   }
      // }}
      colors={['#4db6ac', '#14bfe5', '#ffbd50', '#ffbd50', '#58b160', '#FFB52C', '#D7D7D7', '#77BB5A', '#DAE3EF']}
      margin={{ top: 60, right: 60, bottom: 50, left: 60 }}
      xScale={xScale === 'empty' ? undefined : (xScale || {
        type: 'time',
        format: '%Y-%m-%d',
        precision: 'day',
      })}
      xFormat="time:%Y-%m-%d"
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
      axisTop={null}
      axisRight={null}
      axisBottom={axisBottom || {
        format: '%Y/%-m/%-d',
        tickRotation: 15,
        // tickValues: 'every 2 weeks',
        tickValues: 6,
        legend: 'Date',
        legendOffset: 40,
        legendPosition: 'middle'
      }}
      axisLeft={axisLeft ? {
        ...axisLeft,
        format: v => {
          if (v > 10000000000) {
            return `${v/1000000000} bn`;
          }
          if (v > 100000000) {
            return `${v/1000000} m`;
          }
          if (v > 100000) {
            return `${v/1000} k`;
          }
          return v;
        },
      } : {
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        // legend: 'Metric Tons',
        legendOffset: -50,
        legendPosition: 'middle',
        format: v => {
          if (v > 100000) {
            return `${v/1000} k`;
          }
          if (v > 100000000) {
            return `${v/1000000} m`;
          }
          return v;
        },
      }}
      pointSize={0}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="y"
      pointLabelYOffset={0}
      useMesh={true}
      legends={[
        {
          onClick: (d) => {
            console.log('onclick', d);
          },
          anchor: 'top-left',
          direction: 'row',
          justify: false,
          translateX: -50,
          translateY: -60,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 130,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
    />
  )
}
export default NivoLine;
