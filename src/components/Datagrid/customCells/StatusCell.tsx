import { DotStatus } from "@dashboard/components/StatusDot/StatusDot";
import { getDotColor } from "@dashboard/misc";
import { CustomCell, CustomRenderer, GridCellKind } from "@glideapps/glide-data-grid";
import { ThemeTokensValues } from "@saleor/macaw-ui-next";

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

    ctx.fillStyle = theme.textDark;
    ctx.font = `500 ${theme.fontFamily}`;
    ctx.fillText(cell.data.value, x + 30, y + height / 2);

    const circle = new Path2D();

    circle.arc(x + 15, y + height / 2, 4, 0, 2 * Math.PI);

    const color = getDotColor(cell.data.status, themeValues);

    ctx.fillStyle = color;
    ctx.fill(circle);

    return true;
  },
});
