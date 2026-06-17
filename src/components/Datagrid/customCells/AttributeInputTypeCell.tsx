/**
 * Canvas / Datagrid only — custom cell for attribute input type (icon + label on canvas).
 * Uses renderAttributeInputTypeIconSvg; React lists/forms should not import this.
 */
import { renderAttributeInputTypeIconSvg } from "@dashboard/components/AttributeInputTypeIcon/renderAttributeInputTypeIconSvg";
import { type AttributeInputTypeEnum } from "@dashboard/graphql";
import {
  type CustomCell,
  type CustomRenderer,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

import { drawIconLabelCell, ICON_LABEL_CELL_ICON_SIZE } from "./drawIconLabelCell";

const CELL_KIND = "attribute-input-type-cell";

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
    renderAttributeInputTypeIconSvg(inputType, ICON_LABEL_CELL_ICON_SIZE, color, { hasUnit }),
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
    cursor: "pointer",
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
  draw: (args, cell) =>
    drawIconLabelCell(
      args,
      getIconDataUri(cell.data.inputType, args.theme.textLight, cell.data.hasUnit),
      cell.data.label,
    ),
};
