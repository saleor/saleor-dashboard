import { isFlatFilterLayout } from "./filterLayout";
import { type ConditionalFiltersLayout } from "./Root";

/**
 * The Conditions popover is min 636px (original) and may grow with the row,
 * but never past the viewport. Value is a fixed 200px so pills wrap instead
 * of widening the panel. `in` stays narrow. Remove is `auto` (not `1fr`).
 */
export const getGridTemplateColumns = (
  layout: ConditionalFiltersLayout,
  isAttribute: boolean,
): string => {
  if (isFlatFilterLayout(layout)) {
    return isAttribute
      ? "minmax(140px, 0.7fr) minmax(160px, 0.85fr) minmax(80px, 0.35fr) minmax(200px, 2.2fr) auto"
      : "minmax(140px, 0.75fr) minmax(80px, 0.35fr) minmax(200px, 2.2fr) auto";
  }

  return isAttribute ? "140px 160px 80px 200px auto" : "140px 80px 200px auto";
};
