import React from 'react';
import { ResponsivePie } from '@nivo/pie'

const defaultData = [
  {
    "id": "Supplier A",
    "label": "Supplier A",
    "value": 531,
    "color": "hsl(87, 70%, 50%)"
  },
  {
    "id": "Supplier B",
    "label": "Supplier B",
    "value": 284,
    "color": "hsl(151, 70%, 50%)"
  },
  {
    "id": "Internal",
    "label": "Internal",
    "value": 210,
    "color": "hsl(29, 70%, 50%)"
  },
]

const NivoPie = ({ data, renderEmpty: RenderEmpty /* see data tab */ }) => {
  if (!data[0] || !data[0].value) return <RenderEmpty />
  const sum = data.reduce((prev, curr) => prev + curr.value, 0);
  return(
    <ResponsivePie
      data={data || defaultData}
      margin={{ top: 40, right: 60, bottom: 70, left: 60 }}
      padAngle={0.7}
      cornerRadius={0}
      enableRadialLabels={false}
      colors={['#4db6ac', '#14bfe5', '#275f6c', '#ffbd50', '#58b160', '#B8E4A5', '#FFB52C', '#D7D7D7', '#77BB5A', '#DAE3EF']}
      borderWidth={0}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
      innerRadius={0.35}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#FFF"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: 'color' }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#FFF"
      sliceLabel={(d) => {
        const percent = d.value / sum * 100
        if (percent < 4) return null;
        return `${percent.toFixed(1)}%`;
      }}
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: -30,
          translateY: 65,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 20,
          itemHeight: 20,
          itemTextColor: '#333',
          symbolSize: 10,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#333'
              }
            }
          ]
        }
    ]}
  />)
}

export default NivoPie;
