import React from "react";

export const NotAllowedInverted: React.FC = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="16" fill="#F5FAFB" />
    <circle cx="20" cy="20" r="20" fill="#FE6E76" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M26.9531 29.7815C24.9914 31.1784 22.5917 32 20 32C13.3726 32 8 26.6274 8 20C8 17.4083 8.82158 15.0086 10.2185 13.0469L26.9531 29.7815ZM29.7815 26.9531L13.0469 10.2185C15.0086 8.82158 17.4083 8 20 8C26.6274 8 32 13.3726 32 20C32 22.5917 31.1784 24.9914 29.7815 26.9531ZM36 20C36 28.8366 28.8366 36 20 36C11.1634 36 4 28.8366 4 20C4 11.1634 11.1634 4 20 4C28.8366 4 36 11.1634 36 20Z"
      fill="white"
    />
  </svg>
);

NotAllowedInverted.displayName = "NotAllowedInverted";
