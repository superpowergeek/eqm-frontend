import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const CircleChecked = (props) => (
  <SvgIcon {...props} style={{fontSize: '1.2rem'}}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
    >
      <g fill="none" fillRule="evenodd">
        <use fill="#4DB6AC" />
        <path fill="#4DB6AC" d="M12.444 0H1.556C.692 0 0 .7 0 1.556v10.888C0 13.3.692 14 1.556 14h10.888c.864 0 1.556-.7 1.556-1.556V1.556C14 .7 13.308 0 12.444 0zm-7 10.889L1.556 7l1.096-1.097 2.792 2.785 5.904-5.904 1.096 1.105-7 7z" />
      </g>
    </svg>
  </SvgIcon>
);

export default CircleChecked;
