/**
 * Canvas / Datagrid only — React UI should render `ModelTypeIcon` instead.
 *
 * Glide Data Grid paints on <canvas>, so cells need SVG markup rather than a component. Lucide
 * ships each icon's raw node data alongside the component, so the same lazy import feeds both.
 */
import {
  type IconNode,
  iconNodeToSvg,
} from "@dashboard/components/AttributeInputTypeIcon/iconNodeToSvg";

import { type ModelTypeIcon, resolveModelTypeIconHex } from "./constants";
import { getLoadedLucideIcon } from "./loadLucideIcon";

/** Lucide `Shapes` — keep in sync with the fallback rendered by ModelTypeIcon.tsx. */
const fallbackIconNode: IconNode = [
  [
    "path",
    {
      d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",
    },
  ],
  ["rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "3.5" }],
];

export const renderModelTypeIconSvg = (
  icon: ModelTypeIcon,
  size: number,
  strokeWidth: number,
  isDark: boolean,
): string =>
  iconNodeToSvg(
    getLoadedLucideIcon(icon.name)?.iconNode ?? fallbackIconNode,
    size,
    strokeWidth,
    resolveModelTypeIconHex(icon.color, isDark),
  );
