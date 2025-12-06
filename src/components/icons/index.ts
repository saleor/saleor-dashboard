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
 * Default stroke width for icons.
 * Lucide defaults to 2, but 1.5 is lighter.
 */
export const iconStrokeWidth = 1.5;

export type IconSize = keyof typeof iconSize;
