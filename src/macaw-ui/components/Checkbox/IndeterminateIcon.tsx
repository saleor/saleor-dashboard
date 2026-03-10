import { forwardRef } from "react";
import { sprinkles, Sprinkles } from "~/theme";

interface IndeterminateIconProps {
  color?: Sprinkles["color"];
}

export const IndeterminateIcon = forwardRef<
  SVGSVGElement,
  IndeterminateIconProps
>(({ color }, ref) => (
  <svg
    viewBox="0 0 8 2"
    width="8"
    height="2"
    className={sprinkles({ color })}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 1C0 0.447715 0.447715 0 1 0H7C7.55228 0 8 0.447715 8 1C8 1.55228 7.55228 2 7 2H1C0.447715 2 0 1.55228 0 1Z"
      fill="currentColor"
    />
  </svg>
));

IndeterminateIcon.displayName = "IndeterminateIcon";
