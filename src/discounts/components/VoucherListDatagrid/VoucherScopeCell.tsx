/**
 * Canvas / Datagrid only — voucher list Scope column (icon + label).
 */
import { attributeInputTypeIconPixelSize } from "@dashboard/components/AttributeInputTypeIcon/types";
import {
  drawIconLabelCell,
  ICON_LABEL_CELL_ICON_SIZE,
} from "@dashboard/components/Datagrid/customCells/drawIconLabelCell";
import {
  type CustomCell,
  type CustomRenderer,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

import { renderVoucherScopeIconSvg, type VoucherScopeIconKind } from "./renderVoucherScopeIconSvg";

const CELL_KIND = "voucher-scope-cell";

interface VoucherScopeCellProps {
  readonly kind: typeof CELL_KIND;
  readonly scopeKind: VoucherScopeIconKind;
  readonly label: string;
}

export type VoucherScopeCell = CustomCell<VoucherScopeCellProps>;

const getIconDataUri = (scopeKind: VoucherScopeIconKind, color: string): string =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    renderVoucherScopeIconSvg(
      scopeKind,
      attributeInputTypeIconPixelSize[ICON_LABEL_CELL_ICON_SIZE],
      color,
    ),
  )}`;

export const voucherScopeCell = (
  scopeKind: VoucherScopeIconKind,
  label: string,
  opts?: Partial<GridCell>,
): VoucherScopeCell => ({
  allowOverlay: false,
  readonly: true,
  cursor: "pointer",
  copyData: label,
  ...opts,
  kind: GridCellKind.Custom,
  data: {
    kind: CELL_KIND,
    scopeKind,
    label,
  },
});

export const voucherScopeCellRenderer: CustomRenderer<VoucherScopeCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is VoucherScopeCell =>
    (cell.data as { kind?: string }).kind === CELL_KIND,
  draw: (args, cell) =>
    drawIconLabelCell(
      args,
      getIconDataUri(cell.data.scopeKind, args.theme.textLight),
      cell.data.label,
    ),
};
