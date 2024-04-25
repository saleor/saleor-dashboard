import { VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import isEqual from "lodash/isEqual";
import { useCallback } from "react";

interface VoucherCodesRowSelection {
  selectedVoucherCodesIds: string[];
  clearRowSelection: () => void;
  handleSetSelectedVoucherCodesIds: (rows: number[], clearSelection: () => void) => void;
}

export const useVoucherCodesRowSelection = (
  voucherCodes: VoucherCode[],
): VoucherCodesRowSelection => {
  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    clearRowSelection,
    setSelectedRowIds,
  } = useRowSelection();
  const handleSetSelectedVoucherCodesIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!voucherCodes) {
        return;
      }

      const rowsIds = rows.map(row => voucherCodes[row]?.code).filter(Boolean);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds as string[]);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [voucherCodes, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return {
    selectedVoucherCodesIds: selectedRowIds,
    handleSetSelectedVoucherCodesIds,
    clearRowSelection,
  };
};
