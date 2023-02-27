import { createSvgIcon } from "@material-ui/core/utils";
import React from "react";

const CheckboxChecked = createSvgIcon(
  <>
    <rect x="5" y="5" width="14" height="14" fill="currentColor" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M 16.7527 9.33783 L 10.86618 15.7595 L 8 12.32006 L 8.76822 11.67988 L 10.90204 14.24046 L 16.0155 8.66211 L 16.7527 9.33783 Z"
      fill="white"
    />
  </>,
  "CheckboxChecked",
);

export default CheckboxChecked;
