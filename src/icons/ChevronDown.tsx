import createSvgIcon from "@material-ui/icons/utils/createSvgIcon";
import React from "react";

const ChevronDown = createSvgIcon(
  <svg width="10" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1L5 5L9 1"
      stroke="#28234A"
      stroke-opacity="0.4"
      stroke-width="2"
    />
  </svg>,
  "ChevronDown"
);

export default ChevronDown;
