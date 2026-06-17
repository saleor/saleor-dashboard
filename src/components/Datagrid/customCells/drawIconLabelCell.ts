/**
 * Canvas / Datagrid only — shared draw logic for icon + label custom cells.
 */
import {
  attributeInputTypeIconPixelSize,
  type AttributeInputTypeIconSize,
} from "@dashboard/components/AttributeInputTypeIcon/types";
import { getMiddleCenterBias, type Theme } from "@glideapps/glide-data-grid";

export const ICON_LABEL_CELL_ICON_SIZE: AttributeInputTypeIconSize = "xsmall";

const ICON_GAP = 4;
const X_PAD = 8;

interface DrawIconLabelCellArgs {
  rect: { x: number; y: number; width: number; height: number };
  ctx: CanvasRenderingContext2D;
  theme: Theme;
  imageLoader: {
    loadOrGetImage: (
      url: string,
      col: number,
      row: number,
    ) => HTMLImageElement | ImageBitmap | undefined;
  };
  col: number;
  row: number;
}

export const drawIconLabelCell = (
  args: DrawIconLabelCellArgs,
  iconDataUri: string,
  label: string,
): boolean => {
  const { rect, ctx, theme, imageLoader, col, row } = args;
  const pixelSize = attributeInputTypeIconPixelSize[ICON_LABEL_CELL_ICON_SIZE];
  const textX = rect.x + X_PAD + pixelSize + ICON_GAP;
  const image = imageLoader.loadOrGetImage(iconDataUri, col, row);

  if (image) {
    const iconY = rect.y + (rect.height - pixelSize) / 2;

    ctx.drawImage(image, rect.x + X_PAD, iconY, pixelSize, pixelSize);
  }

  ctx.fillStyle = theme.textDark;
  ctx.font = theme.baseFontStyle;
  ctx.fillText(label, textX, rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme));

  return true;
};
