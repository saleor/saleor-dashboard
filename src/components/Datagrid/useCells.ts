import { useCustomCells } from "@glideapps/glide-data-grid";
import useLocale from "@saleor/hooks/useLocale";
import { useMemo } from "react";

import { moneyCellRenderer } from "./MoneyCell";
import { numberCellRenderer } from "./NumberCell";

function useCells() {
  const { locale } = useLocale();
  const value = useMemo(
    () => [moneyCellRenderer(locale), numberCellRenderer(locale)],
    [locale]
  );

  return useCustomCells(value);
}

export default useCells;
