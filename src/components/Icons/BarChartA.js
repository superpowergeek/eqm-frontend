import React from 'react';
import { chartTypes, chartTypesValueMap } from '@constants';

const BarChartA = ({ value, onClick}) => (
  <div onClick={ onClick }>
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <g fill="none" fillRule="evenodd">
          <rect width="35.5" height="35.5" x=".25" y=".25" fill="#FFF" stroke={value === chartTypesValueMap[chartTypes.BAR_CHART] ? '#5EBDB4' : '#fff'} strokeWidth=".5" rx="2"/>
          <path fill="#4DB6AC" d="M8 10.5h3c.552 0 1 .448 1 1v24H7v-24c0-.552.448-1 1-1z" opacity=".9"/>
          <path fill="#14BFE5" d="M17 6.5h3c.552 0 1 .448 1 1v28h-5v-28c0-.552.448-1 1-1z" opacity=".9"/>
          <path fill="#FFBD50" d="M26 20.5h3c.552 0 1 .448 1 1v14h-5v-14c0-.552.448-1 1-1z" opacity=".95"/>
      </g>
    </svg>
  </div>
);

export default BarChartA;