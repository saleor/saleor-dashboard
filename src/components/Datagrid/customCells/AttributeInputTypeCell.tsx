/**
 * Canvas / Datagrid only — custom cell for attribute input type (icon + label on canvas).
 * Uses renderAttributeInputTypeIconSvg; React lists/forms should not import this.
 */
import { renderAttributeInputTypeIconSvg } from "@dashboard/components/AttributeInputTypeIcon/renderAttributeInputTypeIconSvg";
import {
  attributeInputTypeIconPixelSize,
  type AttributeInputTypeIconSize,
} from "@dashboard/components/AttributeInputTypeIcon/types";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

const CELL_KIND = "attribute-input-type-cell";
const ICON_SIZE: AttributeInputTypeIconSize = "xsmall";
const ICON_GAP = 4;
const X_PAD = 8;

interface AttributeInputTypeCellProps {
  readonly kind: typeof CELL_KIND;
  readonly inputType: AttributeInputTypeEnum;
  readonly label: string;
  readonly hasUnit: boolean;
}

export type AttributeInputTypeCell = CustomCell<AttributeInputTypeCellProps>;

const getIconDataUri = (
  inputType: AttributeInputTypeEnum,
  color: string,
  hasUnit: boolean,
): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    renderAttributeInputTypeIconSvg(inputType, ICON_SIZE, color, { hasUnit }),
  )}`;

export const attributeInputTypeCell = (
  inputType: AttributeInputTypeEnum,
  label: string,
  opts?: Partial<GridCell> & { hasUnit?: boolean },
): AttributeInputTypeCell => {
  const { hasUnit = false, ...gridCellOpts } = opts ?? {};

  return {
    allowOverlay: false,
    readonly: true,
    copyData: label,
    ...gridCellOpts,
    kind: GridCellKind.Custom,
    data: {
      kind: CELL_KIND,
      inputType,
      label,
      hasUnit,
    },
  };
};

export const attributeInputTypeCellRenderer: CustomRenderer<AttributeInputTypeCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is AttributeInputTypeCell =>
    (cell.data as AttributeInputTypeCellProps).kind === CELL_KIND,
  draw: (args, cell) => {
    const { rect, ctx, theme, imageLoader, col, row } = args;
    const iconColor = theme.textLight;
    const image = imageLoader.loadOrGetImage(
      getIconDataUri(cell.data.inputType, iconColor, cell.data.hasUnit),
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
