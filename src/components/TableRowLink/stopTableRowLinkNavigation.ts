import { type MouseEvent } from "react";

/** Cancel the browser following an ancestor or overlapping row/name `<a>`. */
export const stopTableRowLinkNavigation = (event: MouseEvent): void => {
  event.preventDefault();
  event.stopPropagation();
};
