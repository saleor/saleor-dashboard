/**
 * Canvas / Datagrid only — React lists should render `ModelTypeIcon` instead.
 *
 * The icon is resolved from the lazy Lucide cache, so callers must await
 * `preloadLucideIcons` before the grid paints; an unresolved name falls back to `Shapes`.
 */
import {
  attributeInputTypeIconPixelSize,
  attributeInputTypeIconStrokeWidthBySize,
} from "@dashboard/components/AttributeInputTypeIcon/types";
import { type ModelTypeIcon } from "@dashboard/components/ModelTypeIcon/constants";
import { renderModelTypeIconSvg } from "@dashboard/components/ModelTypeIcon/renderModelTypeIconSvg";
import {
  type CustomCell,
  type CustomRenderer,
  type GridCell,
  GridCellKind,
} from "@glideapps/glide-data-grid";

import { drawIconLabelCell, ICON_LABEL_CELL_ICON_SIZE } from "./drawIconLabelCell";

const CELL_KIND = "model-type-cell";

interface ModelTypeCellProps {
  readonly kind: typeof CELL_KIND;
  readonly icon: ModelTypeIcon;
  readonly label: string;
  readonly isDark: boolean;
}

type ModelTypeCell = CustomCell<ModelTypeCellProps>;

export const modelTypeCell = (
  icon: ModelTypeIcon,
  label: string,
  isDark: boolean,
  opts?: Partial<GridCell>,
): ModelTypeCell => ({
  allowOverlay: false,
  readonly: true,
  cursor: "pointer",
  copyData: label,
  ...opts,
  kind: GridCellKind.Custom,
  data: {
    kind: CELL_KIND,
    icon,
    label,
    isDark,
  },
});

export const modelTypeCellRenderer: CustomRenderer<ModelTypeCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell: CustomCell): cell is ModelTypeCell =>
    (cell.data as ModelTypeCellProps).kind === CELL_KIND,
  draw: (args, cell) =>
    drawIconLabelCell(
      args,
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
        renderModelTypeIconSvg(
          cell.data.icon,
          attributeInputTypeIconPixelSize[ICON_LABEL_CELL_ICON_SIZE],
          attributeInputTypeIconStrokeWidthBySize[ICON_LABEL_CELL_ICON_SIZE],
          cell.data.isDark,
        ),
      )}`,
      cell.data.label,
    ),
};
