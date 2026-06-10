import {
  type CustomCell,
  type CustomRenderer,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

export type SkeletonCellVariant = "default" | "narrow";

export interface SkeletonCellProps {
  readonly kind: "skeleton-cell";
  readonly variant: SkeletonCellVariant;
}

export type SkeletonCell = CustomCell<SkeletonCellProps>;

const SKELETON_HEIGHT = 12;
const SKELETON_RADIUS = 4;

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void => {
  if ("roundRect" in ctx) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();
  }
};

const drawSkeletonBar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  fillStyle: string,
): void => {
  ctx.fillStyle = fillStyle;
  drawRoundedRect(ctx, x, y, width, SKELETON_HEIGHT, SKELETON_RADIUS);
};

export const skeletonCellRenderer: CustomRenderer<SkeletonCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is SkeletonCell =>
    (cell.data as SkeletonCellProps | undefined)?.kind === "skeleton-cell",
  draw: (args, cell) => {
    const { rect, ctx, theme } = args;
    const padding = theme.cellHorizontalPadding ?? 8;
    const fillStyle = theme.accentLight;
    const barY = rect.y + (rect.height - SKELETON_HEIGHT) / 2;
    const widthRatio = cell.data.variant === "narrow" ? 0.35 : 0.6;
    const barWidth = Math.max(24, (rect.width - padding * 2) * widthRatio);

    drawSkeletonBar(ctx, rect.x + padding, barY, barWidth, fillStyle);

    return true;
  },
};

export function skeletonCell(variant: SkeletonCellVariant = "default"): GridCell {
  return {
    kind: GridCellKind.Custom,
    allowOverlay: false,
    readonly: true,
    copyData: "",
    data: {
      kind: "skeleton-cell",
      variant,
    },
  };
}
