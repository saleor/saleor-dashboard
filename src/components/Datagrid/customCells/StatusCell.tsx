import { type DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { getDotColor } from "@dashboard/misc";
import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import { type ThemeTokensValues } from "@saleor/macaw-ui-next";

interface StatusCellProps {
  readonly status: DotStatus;
  readonly value: string;
  readonly kind: "status-cell";
}
export type StatusCell = CustomCell<StatusCellProps>;

export const statusCellRenderer = (themeValues: ThemeTokensValues): CustomRenderer<StatusCell> => ({
  kind: GridCellKind.Custom,
  isMatch: (c): c is StatusCell => (c.data as any).kind === "status-cell",
  draw: (args, cell) => {
    const { rect, ctx, theme } = args;
    const { x, y, height } = rect;
    const padding = theme.cellHorizontalPadding ?? 8;
    const dotRadius = 4;
    const dotX = x + padding + dotRadius;
    const textX = dotX + dotRadius + 8;
    const textY = y + height / 2 + getMiddleCenterBias(ctx, theme);
    const font = `500 ${theme.fontFamily}`;

    ctx.fillStyle = theme.textDark;
    ctx.font = font;
    ctx.fillText(cell.data.value, textX, textY);

    const circle = new Path2D();

    circle.arc(dotX, y + height / 2, dotRadius, 0, 2 * Math.PI);

    const color = getDotColor(cell.data.status, themeValues);

    ctx.fillStyle = color;
    ctx.fill(circle);

    return true;
  },
});
