import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const CircleChecked = (props) => (
  <SvgIcon {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
    >
      <g fill="none" fillRule="evenodd">
        <use fill="#EF5423" />
        <path fill="#EF5423" d="M7 0c3.866 0 7 3.134 7 7s-3.134 7-7 7-7-3.134-7-7 3.134-7 7-7zm3.92 3.99c-.31-.232-.748-.17-.98.14L6.223 9.084 3.995 6.855l-.087-.074c-.273-.197-.657-.172-.903.074-.273.273-.273.717 0 .99l3.37 3.37L11.06 4.97l.056-.087c.163-.3.085-.682-.196-.893z" />
      </g>
    </svg>
  </SvgIcon>
);

export default CircleChecked;
