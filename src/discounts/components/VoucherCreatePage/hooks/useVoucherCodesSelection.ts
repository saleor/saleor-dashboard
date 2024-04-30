import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import isEqual from "lodash/isEqual";

import { VoucherCode } from "../../VoucherCodesDatagrid/types";

export const useVoucherCodesSelection = (codes: VoucherCode[]) => {
  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
    clearRowSelection,
  } = useRowSelection();
  const setSelectedVoucherCodesIds = (rows: number[], clearSelection: () => void) => {
    if (!codes) {
      return;
    }

    const rowsIds = rows.map(row => codes[row].code).filter(Boolean);
    const haveSaveValues = isEqual(rowsIds, selectedRowIds);

    if (!haveSaveValues) {
      setSelectedRowIds(rowsIds as string[]);
    }

    setClearDatagridRowSelectionCallback(clearSelection);
  };

  return {
    selectedRowIds,
    setSelectedVoucherCodesIds,
    clearRowSelection,
  };
};
