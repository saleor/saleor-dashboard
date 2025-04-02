import React from "react";

export const DisabledIcon = ({
  height = "20px",
  width = "20px",
  viewBox = "0 0 20 20",
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
    <g clipPath="url(#clip0_478_40539)">
      <path
        d="M9.99984 18.3346C14.6022 18.3346 18.3332 14.6037 18.3332 10.0013C18.3332 5.39893 14.6022 1.66797 9.99984 1.66797C5.39746 1.66797 1.6665 5.39893 1.6665 10.0013C1.6665 14.6037 5.39746 18.3346 9.99984 18.3346Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.0835 4.08203L15.9168 15.9154"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_478_40539">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
