import { useRowSelection } from "@dashboard/hooks/useRowSelection";

interface VoucherCodesRowSelection {
  selectedVoucherCodesIds: string[];
  clearRowSelection: () => void;
  setSelectedVoucherCodesIds: (ids: string[]) => void;
}

export const useVoucherCodesRowSelection = (): VoucherCodesRowSelection => {
  const { selectedRowIds, clearRowSelection, setSelectedRowIds } = useRowSelection();

  return {
    selectedVoucherCodesIds: selectedRowIds,
    setSelectedVoucherCodesIds: setSelectedRowIds,
    clearRowSelection,
  };
};
