import React from 'react';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveStream } from '@nivo/stream';

const nivoData = [
  {
    "Raoul": 109,
  },
  {
    "Raoul": 70,
  },
  {
    "Raoul": 135,
  },
  {
    "Raoul": 198,
  },
  {
    "Raoul": 167,
  },
  {
    "Raoul": 15,
  },
  {
    "Raoul": 65,
  },
  {
    "Raoul": 42,
  },
  {
    "Raoul": 58,
  }
]

const NivoStream = ({ data = nivoData /* see data tab */ }) => (
  <ResponsiveStream
    data={data}
    keys={[ 'Raoul',]}
    curve="linear"
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: '',
      legendOffset: 36
    }}
    axisLeft={{ orient: 'left', tickSize: 5, tickPadding: 5, tickRotation: 0, legend: '', legendOffset: -40 }}
    offsetType="diverging"
    colors={{ scheme: 'nivo' }}
    fillOpacity={0.85}
    borderWidth={1}
    borderColor={{ from: 'color', modifiers: [] }}
    defs={[
      // using helpers
      // will inherit colors from current element
      linearGradientDef('gradientA', [
          { offset: 0, color: '#0294FF' },
          { offset: 100, color: '#0294FF', opacity: 0.13 },
      ]),
    ]}
    fill={[
      {
        match: {
            id: 'Raoul'
        },
        id: 'gradientA'
      },
    ]}
    dotSize={8}
    dotColor={{ from: 'color' }}
    dotBorderWidth={2}
    dotBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.7 ] ] }}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    legends={[
      {
        anchor: 'bottom-right',
        direction: 'column',
        translateX: 100,
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: '#999999',
        symbolSize: 12,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: {
              itemTextColor: '#000000'
            }
          }
        ]
      }
    ]}
  />
)

export default NivoStream;
