import { createSvgIcon } from "@material-ui/core/utils";

/**
 * @deprecated This icon uses Material-UI which is deprecated. Please use Lucide React icons instead.
 * @see https://lucide.dev/ for available icons
 * @example
 * import { GripVertical } from "lucide-react";
 * // Use <GripVertical /> instead
 */
const Drag = createSvgIcon(
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="12" r="1" />
      <circle cx="9" cy="5" r="1" />
      <circle cx="9" cy="19" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="15" cy="5" r="1" />
      <circle cx="15" cy="19" r="1" />
    </svg>
  </>,
  "ArrowSort",
);

export default Drag;
