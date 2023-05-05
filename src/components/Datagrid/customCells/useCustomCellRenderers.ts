import useLocale from "@dashboard/hooks/useLocale";
import { useExtraCells } from "@glideapps/glide-data-grid-cells";
import { useMemo } from "react";

import { dropdownCellRenderer } from "./DropdownCell";
import { moneyCellRenderer } from "./MoneyCell";
import { moneyDiscountedCellRenderer } from "./MoneyDiscountedCell";
import { numberCellRenderer } from "./NumberCell";
import { thumbnailCellRenderer } from "./ThumbnailCell";

export function useCustomCellRenderers() {
  const { locale } = useLocale();
  const { customRenderers } = useExtraCells();

  const renderers = useMemo(
    () => [
      moneyCellRenderer(),
      moneyDiscountedCellRenderer(),
      numberCellRenderer(locale),
      dropdownCellRenderer,
      thumbnailCellRenderer,
      ...customRenderers,
    ],
    [customRenderers, locale],
  );

  return renderers;
}
