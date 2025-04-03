import React from "react";

export const ExclamationIcon = ({
  width = "17",
  height = "17",
  viewBox = "0 0 17 17",
}: {
  width?: string;
  height?: string;
  viewBox?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_466_2501)">
      <path
        d="M8.50008 15.5846C12.4121 15.5846 15.5834 12.4133 15.5834 8.5013C15.5834 4.58929 12.4121 1.41797 8.50008 1.41797C4.58806 1.41797 1.41675 4.58929 1.41675 8.5013C1.41675 12.4133 4.58806 15.5846 8.50008 15.5846Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 5.66797V8.5013"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11.332H8.50607"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_466_2501">
        <rect width="17" height="17" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
