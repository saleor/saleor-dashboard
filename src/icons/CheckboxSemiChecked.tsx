import { createSvgIcon } from "@material-ui/core/utils";
import React from "react";

const CheckboxSemiChecked = createSvgIcon(
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="14" height="14" stroke="#06847B" />
    <rect x="8" y="11" width="8" height="2" fill="#06847B" />
  </svg>,
  "CheckboxSemiChecked",
);

export default CheckboxSemiChecked;
