import useLocale from "@dashboard/hooks/useLocale";
import { useCustomCells } from "@glideapps/glide-data-grid";
import { useMemo } from "react";

import { dropdownCellRenderer } from "./DropdownCell";
import { moneyCellRenderer } from "./MoneyCell";
import { numberCellRenderer } from "./NumberCell";
import { thumbnailCellRenderer } from "./ThumbnailCell";

function useCells() {
  const { locale } = useLocale();
  const value = useMemo(
    () => [
      moneyCellRenderer(),
      numberCellRenderer(locale),
      dropdownCellRenderer,
      thumbnailCellRenderer,
    ],
    [locale],
  );

  return useCustomCells(value);
}

export default useCells;
