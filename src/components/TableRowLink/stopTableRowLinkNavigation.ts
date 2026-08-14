import { type MouseEvent } from "react";

/** TableRowLink wraps cells in an `<a>`. Interactive controls must cancel that. */
export const stopTableRowLinkNavigation = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};
