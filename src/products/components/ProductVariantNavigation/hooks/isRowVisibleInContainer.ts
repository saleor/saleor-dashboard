/** True when `row` intersects the scroll container’s visible area (partial counts). */
export const isRowVisibleInContainer = (row: DOMRect, container: DOMRect): boolean =>
  row.bottom > container.top && row.top < container.bottom;
