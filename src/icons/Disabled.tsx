import React from "react";

export const DisabledIcon = ({
  height = "12px",
  width = "12px",
  viewBox = "0 0 12 12",
}: {
  height?: string;
  width?: string;
  viewBox?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1226_7882)">
      <path
        d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
        stroke="#677686"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.4502 2.44922L9.5502 9.54922"
        stroke="#677686"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1226_7882">
        <rect width="12" height="12" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
