import { Box, BoxProps } from "@saleor/macaw-ui-next";
import React from "react";

export const ErrorCircle = ({
  height = "12px",
  width = "12px",
  viewBox = "0 0 12 12",
  ...props
}: {
  height?: string;
  width?: string;
  viewBox?: string;
} & BoxProps) => {
  return (
    <Box
      as="svg"
      __width={width}
      __height={height}
      // @ts-expect-error viewBox is not defined as BoxProps, but it works correctly
      viewBox={viewBox}
      __fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1226_7835)">
        <path
          d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
          stroke="#BC1B1C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.5 4.5L4.5 7.5"
          stroke="#BC1B1C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.5 4.5L7.5 7.5"
          stroke="#BC1B1C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1226_7835">
          <rect width="12" height="12" fill="white" />
        </clipPath>
      </defs>
    </Box>
  );
};
