/**
 * Canvas / Datagrid only — custom cell for attribute type (icon + label on canvas).
 * Uses renderAttributeClassIconSvg; React lists/forms should not import this.
 */
import { renderAttributeClassIconSvg } from "@dashboard/components/AttributeClass/renderAttributeClassIconSvg";
import {
  attributeInputTypeIconPixelSize,
  type AttributeInputTypeIconSize,
} from "@dashboard/components/AttributeInputTypeIcon/types";
import { type AttributeTypeEnum } from "@dashboard/graphql";
import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

const CELL_KIND = "attribute-type-cell";
const ICON_SIZE: AttributeInputTypeIconSize = "xsmall";
const ICON_GAP = 4;
const X_PAD = 8;

interface AttributeTypeCellProps {
  readonly kind: typeof CELL_KIND;
  readonly attributeType: AttributeTypeEnum;
  readonly label: string;
}

export type AttributeTypeCell = CustomCell<AttributeTypeCellProps>;

const getIconDataUri = (attributeType: AttributeTypeEnum, color: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    renderAttributeClassIconSvg(attributeType, attributeInputTypeIconPixelSize[ICON_SIZE], color),
  )}`;

export const attributeTypeCell = (
  attributeType: AttributeTypeEnum,
  label: string,
  opts?: Partial<GridCell>,
): AttributeTypeCell => ({
  allowOverlay: false,
  readonly: true,
  copyData: label,
  ...opts,
  kind: GridCellKind.Custom,
  data: {
    kind: CELL_KIND,
    attributeType,
    label,
  },
});

export const attributeTypeCellRenderer: CustomRenderer<AttributeTypeCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is AttributeTypeCell =>
    (cell.data as AttributeTypeCellProps).kind === CELL_KIND,
  draw: (args, cell) => {
    const { rect, ctx, theme, imageLoader, col, row } = args;
    const iconColor = theme.textLight;
    const image = imageLoader.loadOrGetImage(
      getIconDataUri(cell.data.attributeType, iconColor),
      col,
      row,
    );
    const pixelSize = attributeInputTypeIconPixelSize[ICON_SIZE];
    const textX = rect.x + X_PAD + pixelSize + ICON_GAP;

    if (image) {
      const iconY = rect.y + (rect.height - pixelSize) / 2;

      ctx.drawImage(image, rect.x + X_PAD, iconY, pixelSize, pixelSize);
    }

    ctx.fillStyle = theme.textDark;
    ctx.font = theme.baseFontStyle;
    ctx.fillText(
      cell.data.label,
      textX,
      rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
    );

    return true;
  },
};
