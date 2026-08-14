/**
 * Canvas / Datagrid only. Lucide `Image` path data for empty product thumbnails.
 * React UI should use EmptyImage instead.
 */
import {
  type IconNode,
  iconNodeToSvg,
} from "@dashboard/components/AttributeInputTypeIcon/iconNodeToSvg";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";

/** Lucide `Image` (lucide-react 0.555.0) — keep in sync with EmptyImage. */
const emptyImageIconNode: IconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["circle", { cx: "9", cy: "9", r: "2" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
];

export const EMPTY_IMAGE_ICON_SIZE = iconSize.small;

export const renderEmptyImageIconSvg = (color: string): string =>
  iconNodeToSvg(emptyImageIconNode, EMPTY_IMAGE_ICON_SIZE, iconStrokeWidthBySize.small, color);

export const getEmptyImageIconDataUri = (color: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(renderEmptyImageIconSvg(color))}`;
