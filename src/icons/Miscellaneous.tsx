import { createSvgIcon, SvgIconProps } from "@material-ui/core";
import React from "react";

const Miscellaneous = createSvgIcon(
  <>
    <rect
      x="3"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke="#252929"
      stroke-width="1.25"
    />
    <rect
      x="14"
      y="3"
      width="7"
      height="7"
      rx="1"
      stroke="#252929"
      stroke-width="1.25"
    />
    <rect
      x="3"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke="#252929"
      stroke-width="1.25"
    />
    <rect
      x="14"
      y="14"
      width="7"
      height="7"
      rx="1"
      stroke="#252929"
      stroke-width="1.25"
    />
  </>,
  "Miscellaneous",
);

export default (props: SvgIconProps) => (
  <Miscellaneous {...props} viewBox="0 0 32 32" fill="none" />
);
