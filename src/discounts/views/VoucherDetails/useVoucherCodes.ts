import { useVoucherCodesQuery } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPaginator, {
  useLocalPaginationState,
} from "@dashboard/hooks/useLocalPaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { ListViews } from "@dashboard/types";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import isEqual from "lodash/isEqual";
import { useCallback } from "react";

export const useVoucherCodes = ({ id }: { id: string }) => {
  const {
    settings: voucherCodesSettings,
    updateListSettings: updateVoucherCodesListSettings,
  } = useListSettings(ListViews.VOUCHER_CODDES_LIST);

  const [voucherCodesPaginationState, setVoucherCodesPaginationState] =
    useLocalPaginationState(voucherCodesSettings.rowNumber);

  const voucherCodesPaginate = useLocalPaginator(
    setVoucherCodesPaginationState,
  );

  const {
    data: voucherCodesData,
    loading: voucherCodesLoading,
    refetch: voucherCodesRefetch,
  } = useVoucherCodesQuery({
    variables: {
      id,
      ...voucherCodesPaginationState,
    },
  });

  const voucherCodesPagination = voucherCodesPaginate(
    voucherCodesData?.voucher?.codes?.pageInfo,
    voucherCodesPaginationState,
  );

  const {
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection();

  const voucherCodes = mapEdgesToItems(voucherCodesData?.voucher?.codes);

  const handleSetSelectedVoucherCodesIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!voucherCodes) {
        return;
      }

      const rowsIds = rows.map(row => voucherCodes[row].code);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      voucherCodes,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return {
    voucherCodes,
    voucherCodesLoading,
    voucherCodesPagination,
    voucherCodesRefetch,
    voucherCodesSettings,
    updateVoucherCodesListSettings,
    selectedVoucherCodesIds: selectedRowIds,
    handleSetSelectedVoucherCodesIds,
  };
};
