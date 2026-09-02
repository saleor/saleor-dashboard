/**
 * A model type (`PageType`) can carry a Lucide icon name and a colour in its public metadata,
 * so merchants can tell types apart at a glance in the sidebar, tabs, lists and reference chips.
 */
export const MODEL_TYPE_ICON_NAME_KEY = "dashboard-icon-name";
export const MODEL_TYPE_ICON_COLOR_KEY = "dashboard-icon-color";

/** Lucide `Shapes`. Rendered for every type without an icon, so the icon slot never reflows. */
export const FALLBACK_ICON_NAME = "shapes";

export const MODEL_TYPE_ICON_COLORS = {
  grey: { light: "#6C6C6C", dark: "#A1A1A1" },
  blue: { light: "#2563EB", dark: "#60A5FA" },
  green: { light: "#15803D", dark: "#4ADE80" },
  amber: { light: "#B45309", dark: "#FBBF24" },
  red: { light: "#DC2626", dark: "#F87171" },
  purple: { light: "#7C3AED", dark: "#A78BFA" },
} as const;

export type ModelTypeIconColor = keyof typeof MODEL_TYPE_ICON_COLORS;

/** Unset colour reads as unstyled. */
export const FALLBACK_ICON_COLOR: ModelTypeIconColor = "grey";

export const MODEL_TYPE_ICON_COLOR_NAMES = Object.keys(
  MODEL_TYPE_ICON_COLORS,
) as ModelTypeIconColor[];

export interface ModelTypeIcon {
  name: string;
  color: ModelTypeIconColor;
}

/**
 * Macaw generates its `--mu-*` colours at runtime through vanilla-extract, so there is no CSS
 * selector to hang a dark variant off, and `ctx.fillStyle` in the datagrid cannot read a CSS
 * variable either. Both consumers therefore resolve a literal hex from this one table.
 */
export const resolveModelTypeIconHex = (color: ModelTypeIconColor, isDark: boolean): string =>
  MODEL_TYPE_ICON_COLORS[color][isDark ? "dark" : "light"];
