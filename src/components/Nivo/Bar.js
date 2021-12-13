import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Chip } from '@nivo/tooltip';
// import { linearGradientDef } from '@nivo/core';
import FlexDiv from 'components/shared/FlexDiv';


const idFormatter = (id, idMap) => {
  const sourceId = id.split('-')[0];
  const item = id.split('-')[1];
  return `${idMap[sourceId]} - ${item}`;
}
const NivoBar = ({ data, renderEmpty: RenderEmpty, keys= ['Carbon'], keysMap = {}, indexBy="date", axisLeft /* see data tab */ }) => {
  const onClickBar = (data) => {
    console.log('data', data);
  }
  if (data.length === 0 || keys.length === 0) return <RenderEmpty />
  
  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      // height={329}
      margin={{ top: 70, right: 70, bottom: 50, left: 60 }}
      padding={0.6}
      // labelFormat={d => <tspan y={-20} fill={"url(#gradientA"} fontWeight={"bold"} fontSize={12}>{d}</tspan>}
      borderRadius={3}
      enableLabel={false}
      onClick={onClickBar}
      // defs={[
      //   linearGradientDef('gradientA', [
      //     { offset: 0, color: 'rgb(246, 106, 107)' },
      //     { offset: 40, color: 'rgb(43, 184, 225)', opacity: 0.75 },
      //   ]),
      // ]}
      tooltip={({ id, value, color }) => {
        return (
          <FlexDiv container row crossAlign="center">
            <Chip color={color} style={{ marginRight: 12 }}/>
            {value !== undefined ? (
                <span>
                  {id}: <strong>{isNaN(value) ? String(value) : value.toFixed(1)}</strong>
                </span>
            ) : (
              id
            )}
          </FlexDiv>
        )
      }}
      // fill={[
      //   {
      //     match: {
      //       id: 'Supplier A'
      //     },
      //     id: 'gradientA'
      //   },
      // ]}
      // colors={{ scheme: 'nivo' }}
      // colors={
      //   ['rgb(42, 55, 70, 0.8)', 'rgb(246, 106, 107, 0.8)', 'rgb(43, 184, 225, 0.8)']
      // }
      // colors={['#EC6B56', '#FFC154', '#47B39C']}
      colors={['#4db6ac', '#14bfe5', '#275f6c', '#ffbd50', '#58b160', '#FFB52C', '#D7D7D7', '#77BB5A', '#DAE3EF']}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 15,
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
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        // legend: 'Amount in Tons',
        legendPosition: 'middle',
        legendOffset: -50,
        format: v => {
          if (v > 100000) {
            return `${v/1000} k`;
          }
          return v;
        },
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'top-left',
          direction: 'row',
          justify: false,
          translateX: -50,
          translateY: -60,
          itemsSpacing: 2,
          itemWidth: 130,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1
              }
            }
          ]
        }
      ]}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      groupMode="grouped"
      enableGridY={true}
      enableGridX={false}
    />
  )
}

export default NivoBar;
