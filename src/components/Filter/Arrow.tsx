import React from "react";

const Arrow: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    width="18"
    height="21"
    viewBox="0 0 18 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5858 17.1357L-1.37065e-07 17.1357L-1.37065e-07 15L-1.37064e-07 0L2 -8.74228e-08L2 15.1357L13.5858 15.1357L11.8643 13.4142L13.2785 12L17.4142 16.1357L13.2785 20.2714L11.8643 18.8571L13.5858 17.1357Z"
      fill="#3D3D3D"
    />
  </svg>
);

Arrow.displayName = "Arrow";
export default Arrow;
