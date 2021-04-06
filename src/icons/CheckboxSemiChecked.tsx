import createSvgIcon from "@material-ui/icons/utils/createSvgIcon";
import React from "react";

const CheckboxSemiChecked = createSvgIcon(
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="5"
      y="5"
      width="14"
      height="14"
      rx="1.5"
      fill="#056DFF"
      stroke="#036DFF"
    />
    <rect x="7" y="10" width="10" height="4" rx="1.5" fill="white" />
  </svg>,
  "CheckboxSemiChecked"
);

export default CheckboxSemiChecked;
