import { forwardRef } from "react";
import { sprinkles, Sprinkles } from "~/theme";

interface CheckedIconProps {
  color?: Sprinkles["color"];
}

export const CheckedIcon = forwardRef<SVGSVGElement, CheckedIconProps>(
  ({ color }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 8 8"
      width="8"
      height="8"
      className={sprinkles({ color })}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.70711 1.25C8.09763 1.64052 8.09763 2.27369 7.70711 2.66421L3.20711 7.16421C2.81658 7.55474 2.18342 7.55474 1.79289 7.16421L0.292894 5.66421C-0.0976308 5.27369 -0.0976306 4.64052 0.292894 4.25C0.683418 3.85947 1.31658 3.85948 1.70711 4.25L2.5 5.04289L6.29289 1.25C6.68342 0.859475 7.31658 0.859475 7.70711 1.25Z"
        fill="currentColor"
      />
    </svg>
  )
);

CheckedIcon.displayName = "CheckedIcon";
