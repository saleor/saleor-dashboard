import { createSvgIcon } from "@material-ui/core/utils";

/**
 * @deprecated This icon uses Material-UI which is deprecated. Please use Lucide React icons instead.
 * @see https://lucide.dev/ for available icons
 * @example
 * import { ChevronDown } from "lucide-react";
 * // Use <ChevronDown /> instead
 */
const ArrowDropdown = createSvgIcon(
  <g style={{ fillRule: "evenodd" }}>
    <path d="M7 10l5 5 5-5z" />
  </g>,
  "ArrowDropdown",
);

export default ArrowDropdown;
