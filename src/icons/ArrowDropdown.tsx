import { createSvgIcon } from "@material-ui/core/utils";
import React from "react";

const ArrowDropdown = createSvgIcon(
  <g style={{ fillRule: "evenodd" }}>
    <path d="M7 10l5 5 5-5z" />
  </g>,
  "ArrowDropdown",
);

export default ArrowDropdown;
