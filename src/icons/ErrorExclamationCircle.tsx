import { createSvgIcon } from "@material-ui/core/utils";
import React from "react";

const ErrorExclamationCircle = createSvgIcon(
  <>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#FE6D76" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.75 6H11.25V15H12.75V6ZM12.75 16.5H11.25V18H12.75V16.5Z"
        fill="white"
      />
    </svg>
  </>,
  "ErrorExclamationCircle",
);

export default ErrorExclamationCircle;
