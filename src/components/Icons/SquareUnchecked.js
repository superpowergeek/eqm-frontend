import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const CircleChecked = (props) => (
  <SvgIcon {...props} style={{fontSize: '1.2rem'}}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
    >
      <g fill="none" fillRule="evenodd">
        <use fill="#EBEBEB" />
        <path fill="#EBEBEB" d="M12.5 0c.828 0 1.5.672 1.5 1.5v11c0 .828-.672 1.5-1.5 1.5h-11C.672 14 0 13.328 0 12.5v-11C0 .672.672 0 1.5 0h11zm0 1h-11c-.245 0-.45.177-.492.41L1 1.5v11c0 .245.177.45.41.492L1.5 13h11c.245 0 .45-.177.492-.41L13 12.5v-11c0-.245-.177-.45-.41-.492L12.5 1z" />
      </g>
    </svg>
  </SvgIcon>
);

export default CircleChecked;
