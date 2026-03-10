import { forwardRef } from "react";

import { classNames } from "~/utils";

import { spinner } from "./Spinner.css";

export const Spinner = forwardRef<SVGSVGElement, { className?: string }>(
  ({ className }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      className={classNames(spinner, className)}
      data-macaw-ui-component="Spinner"
      ref={ref}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.333"
      >
        <path d="M8 1.332v2.667M8 12v2.667M3.285 3.285l1.887 1.887M10.826 10.826l1.887 1.887M1.332 8h2.667M12 8h2.667M3.285 12.713l1.887-1.887M10.826 5.172l1.887-1.887" />
      </g>
    </svg>
  )
);

Spinner.displayName = "Spinner";
