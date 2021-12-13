import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const BarChartB = props => (
  <SvgIcon {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <g fill="none" fillRule="evenodd">
          <rect width="35.5" height="35.5" x=".25" y=".25" fill="#FFF" stroke={props.type === 2 ? '#5EBDB4' : '#fff'} strokeWidth=".5" rx="2"/>
          <path fill="#FFC159" d="M8 10.6h3c.552 0 1 .448 1 1v24H7v-24c0-.552.448-1 1-1z"/>
          <path fill="#5EBDB4" d="M8 22.6h3c.552 0 1 .448 1 1v12H7v-12c0-.552.448-1 1-1z"/>
          <path fill="#FFC159" d="M17 6.6h3c.552 0 1 .448 1 1v28h-5v-28c0-.552.448-1 1-1z"/>
          <path fill="#5EBDB4" d="M17 15.6h3c.552 0 1 .448 1 1v19h-5v-19c0-.552.448-1 1-1z"/>
          <path fill="#FFC159" d="M26 20.6h3c.552 0 1 .448 1 1v14h-5v-14c0-.552.448-1 1-1z"/>
          <path fill="#5EBDB4" d="M26 28.6h3c.552 0 1 .448 1 1v6h-5v-6c0-.552.448-1 1-1z"/>
      </g>
    </svg>
  </SvgIcon>
);

export default BarChartB;