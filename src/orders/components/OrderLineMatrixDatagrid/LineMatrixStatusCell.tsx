import { getStatusColor } from "@dashboard/misc";
import {
  getOrderLineRollupPillType,
  renderLineMatrixStatusIconSvg,
} from "@dashboard/orders/components/OrderLineMatrixDatagrid/renderLineMatrixStatusIconSvg";
import { type OrderLineRollupStatus } from "@dashboard/orders/utils/getOrderLineRollupStatus";
import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import { type ThemeTokensValues } from "@saleor/macaw-ui-next";

const CELL_KIND = "line-matrix-status-cell";
const CIRCLE_ICON_SIZE = 28;
const ICON_GAP = 8;
/** Compensates for removing the matrix empty spacer column (was 20px). */
const STATUS_CELL_LEADING_INSET = 12;

const statusSvgDataUriCache = new Map<string, string>();

const getStatusSvgDataUri = (
  rollupStatus: OrderLineRollupStatus,
  colors: { base: string; border: string; text: string },
  expanded: boolean,
  iconColor: string,
): string => {
  const cacheKey = `${rollupStatus}:${expanded}:${iconColor}:${colors.base}:${colors.border}:${colors.text}`;
  const cached = statusSvgDataUriCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const svg = renderLineMatrixStatusIconSvg(rollupStatus, colors, expanded, iconColor);
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  statusSvgDataUriCache.set(cacheKey, dataUri);

  return dataUri;
};

interface LineMatrixStatusCellProps {
  readonly kind: typeof CELL_KIND;
  readonly rollupStatus: OrderLineRollupStatus;
  readonly label: string;
  readonly expanded: boolean;
  readonly muted?: boolean;
}

export type LineMatrixStatusCell = CustomCell<LineMatrixStatusCellProps>;

export const lineMatrixStatusCell = (
  rollupStatus: OrderLineRollupStatus,
  label: string,
  expanded: boolean,
  opts?: Partial<GridCell>,
): LineMatrixStatusCell => ({
  allowOverlay: false,
  readonly: true,
  cursor: "pointer",
  copyData: label,
  ...opts,
  kind: GridCellKind.Custom,
  data: {
    kind: CELL_KIND,
    rollupStatus,
    label,
    expanded,
  },
});

export const lineMatrixStatusCellRenderer = (
  themeValues: ThemeTokensValues,
  currentTheme: "defaultLight" | "defaultDark",
): CustomRenderer<LineMatrixStatusCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is LineMatrixStatusCell =>
    (cell.data as LineMatrixStatusCellProps).kind === CELL_KIND,
  draw: (args, cell) => {
    const { rect, ctx, theme, imageLoader, col, row } = args;
    const padding = (theme.cellHorizontalPadding ?? 8) + STATUS_CELL_LEADING_INSET;
    const pillType = getOrderLineRollupPillType(cell.data.rollupStatus);
    const colors = getStatusColor({ status: pillType, currentTheme });
    const iconColor = cell.data.muted
      ? themeValues.colors.text.default2
      : themeValues.colors.text.default1;
    const dataUri = getStatusSvgDataUri(
      cell.data.rollupStatus,
      colors,
      cell.data.expanded,
      iconColor,
    );
    const image = imageLoader.loadOrGetImage(dataUri, col, row);
    const textX = rect.x + padding + CIRCLE_ICON_SIZE + ICON_GAP;
    const font = `500 ${theme.fontFamily}`;

    if (cell.data.muted) {
      ctx.globalAlpha = 0.55;
    }

    if (image) {
      const iconY = rect.y + (rect.height - CIRCLE_ICON_SIZE) / 2;

      ctx.drawImage(image, rect.x + padding, iconY, CIRCLE_ICON_SIZE, CIRCLE_ICON_SIZE);
    }

    ctx.fillStyle = theme.textDark;
    ctx.font = font;
    ctx.fillText(cell.data.label, textX, rect.y + rect.height / 2 + getMiddleCenterBias(ctx, font));

    ctx.globalAlpha = 1;

    return true;
  },
});
