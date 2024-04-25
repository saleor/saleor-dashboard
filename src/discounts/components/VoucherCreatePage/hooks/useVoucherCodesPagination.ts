import useListSettings, { UseListSettings } from "@dashboard/hooks/useListSettings";
import useLocalPageInfo from "@dashboard/hooks/useLocalPageInfo";
import { LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { ListViews } from "@dashboard/types";

import { VoucherCode } from "../../VoucherCodesDatagrid/types";

export interface UseVoucherCodesPagination {
  pagination: LocalPagination;
  paginatedCodes: VoucherCode[];
  onSettingsChange: UseListSettings["updateListSettings"];
  settings: UseListSettings["settings"];
  resetPage: () => void;
}

export const useVoucherCodesPagination = (
  voucherCodes: VoucherCode[],
): UseVoucherCodesPagination => {
  const { settings, updateListSettings } = useListSettings(ListViews.VOUCHER_CODES);
  const { loadNextPage, loadPreviousPage, pageInfo, pageValues, resetPage } = useLocalPageInfo(
    voucherCodes,
    settings.rowNumber,
  );

  return {
    paginatedCodes: pageValues,
    settings,
    onSettingsChange: updateListSettings,
    resetPage,
    pagination: {
      loadNextPage,
      loadPreviousPage,
      paginatorType: "click",
      pageInfo: {
        ...pageInfo,
        endCursor: pageInfo.endCursor.toString(),
        startCursor: pageInfo.startCursor.toString(),
      },
    },
  };
};
