/**
 * Canvas / Datagrid only — custom cell for attribute type (icon + label on canvas).
 * Uses renderAttributeClassIconSvg; React lists/forms should not import this.
 */
import { renderAttributeClassIconSvg } from "@dashboard/components/AttributeClass/renderAttributeClassIconSvg";
import { attributeInputTypeIconPixelSize } from "@dashboard/components/AttributeInputTypeIcon/types";
import { type AttributeTypeEnum } from "@dashboard/graphql";
import {
  type CustomCell,
  type CustomRenderer,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

import { drawIconLabelCell, ICON_LABEL_CELL_ICON_SIZE } from "./drawIconLabelCell";

const CELL_KIND = "attribute-type-cell";

interface AttributeTypeCellProps {
  readonly kind: typeof CELL_KIND;
  readonly attributeType: AttributeTypeEnum;
  readonly label: string;
}

export type AttributeTypeCell = CustomCell<AttributeTypeCellProps>;

const getIconDataUri = (attributeType: AttributeTypeEnum, color: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    renderAttributeClassIconSvg(
      attributeType,
      attributeInputTypeIconPixelSize[ICON_LABEL_CELL_ICON_SIZE],
      color,
    ),
  )}`;

export const attributeTypeCell = (
  attributeType: AttributeTypeEnum,
  label: string,
  opts?: Partial<GridCell>,
): AttributeTypeCell => ({
  allowOverlay: false,
  readonly: true,
  cursor: "pointer",
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
  draw: (args, cell) =>
    drawIconLabelCell(
      args,
      getIconDataUri(cell.data.attributeType, args.theme.textLight),
      cell.data.label,
    ),
};
