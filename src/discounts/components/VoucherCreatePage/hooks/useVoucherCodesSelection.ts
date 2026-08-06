import { useRowSelection } from "@dashboard/hooks/useRowSelection";

export const useVoucherCodesSelection = () => {
  const { selectedRowIds, setSelectedRowIds, clearRowSelection } = useRowSelection();

  return {
    selectedRowIds,
    setSelectedVoucherCodesIds: setSelectedRowIds,
    clearRowSelection,
  };
};
