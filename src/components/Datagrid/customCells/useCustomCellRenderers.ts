import { dateCellRenderer } from "@dashboard/components/Datagrid/customCells/DateCell";
import useLocale from "@dashboard/hooks/useLocale";
import { lineMatrixStatusCellRenderer } from "@dashboard/orders/components/OrderLineMatrixDatagrid/LineMatrixStatusCell";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
import { useTheme } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

import { attributeInputTypeCellRenderer } from "./AttributeInputTypeCell"; // canvas-only
import { attributeTypeCellRenderer } from "./AttributeTypeCell"; // canvas-only
import { dropdownCellRenderer } from "./DropdownCell";
import { moneyCellRenderer } from "./Money/MoneyCell";
import { moneyDiscountedCellRenderer } from "./Money/MoneyDiscountedCell";
import { numberCellRenderer } from "./NumberCell";
import { pillCellRenderer } from "./PillCell";
import { skeletonCellRenderer } from "./SkeletonCell";
import { statusCellRenderer } from "./StatusCell";
import { thumbnailCellRenderer } from "./ThumbnailCell";

export function useCustomCellRenderers() {
  const { locale } = useLocale();
  const { customRenderers } = useExtraCells();
  const { themeValues, theme: currentTheme } = useTheme();
  const renderers = useMemo(
    () => [
      pillCellRenderer(),
      attributeInputTypeCellRenderer,
      attributeTypeCellRenderer,
      statusCellRenderer(themeValues),
      moneyCellRenderer(locale),
      moneyDiscountedCellRenderer(),
      numberCellRenderer(locale),
      dateCellRenderer(locale),
      lineMatrixStatusCellRenderer(themeValues, currentTheme),
      dropdownCellRenderer,
      skeletonCellRenderer,
      thumbnailCellRenderer,
      ...customRenderers,
    ],
    [customRenderers, currentTheme, locale, themeValues],
  );

  return renderers;
}
