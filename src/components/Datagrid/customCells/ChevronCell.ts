import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { CustomRenderer, GridCellKind } from "@glideapps/glide-data-grid";

import { ChevronCell } from "./cells";

const lucideChevronPoints = {
  down: [
    [6, 9],
    [12, 15],
    [18, 9],
  ],
  right: [
    [9, 6],
    [15, 12],
    [9, 18],
  ],
} as const;

export const chevronCellRenderer: CustomRenderer<ChevronCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell): cell is ChevronCell => (cell.data as { kind?: string }).kind === "chevron-cell",
  draw: (args, cell) => {
    const { ctx, rect, theme } = args;
    const cellData = cell.data;
    const points = lucideChevronPoints[cellData.direction];
    const size = iconSize.small;
    const strokeWidth = iconStrokeWidthBySize.small;
    const scale = size / 24;
    const originX = rect.x + (rect.width - size) / 2;
    const originY = rect.y + (rect.height - size) / 2;
    const [firstPoint, ...restPoints] = points;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = theme.textDark;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(originX + firstPoint[0] * scale, originY + firstPoint[1] * scale);

    restPoints.forEach(([x, y]) => {
      ctx.lineTo(originX + x * scale, originY + y * scale);
    });

    ctx.stroke();
    ctx.restore();

    return true;
  },
};
