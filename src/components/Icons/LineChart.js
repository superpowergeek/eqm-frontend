import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import { chartTypes, chartTypesValueMap } from '@constants';

const LineChart = ({ value, onClick}) => (
  <div onClick={ onClick } style={{marginRight: 16}}>
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <g fill="none" fillRule="evenodd">
          <rect width="35.5" height="35.5" x=".25" y=".25" stroke={ value === chartTypesValueMap[chartTypes.LINE_CHART] ? '#5EBDB4' : '#fff'} strokeWidth=".5" rx="2"/>
          <path fill="#5EBDB4" d="M0 20.5L5 26l10-15 10.5 17.5 5-5 5.5 7V34c0 1.105-.895 2-2 2H2c-1.105 0-2-.895-2-2V20.5z"/>
      </g>
    </svg>
  </div>
);

export default LineChart;