/**
 * Icon size mappings for Lucide icons.
 *
 * Use these with Lucide's `size` prop to maintain consistency.
 *
 * @example
 * import { Search } from "lucide-react";
 * import { iconSize } from "@dashboard/components/icons";
 *
 * <Search size={iconSize.small} />
 */
export const iconSize = {
  small: 16,
  medium: 20,
  large: 24,
} as const;

/**
 * Stroke width mappings for Lucide icons by size.
 * Smaller icons need thicker strokes for visibility.
 */
export const iconStrokeWidthBySize = {
  small: 2,
  medium: 1.5,
  large: 1.5,
} as const;

/**
 * Default stroke width for icons.
 * Lucide defaults to 2, but 1.5 is lighter for medium/large icons.
 */
export const iconStrokeWidth = 1.5;

export type IconSize = keyof typeof iconSize;
