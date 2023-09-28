import { PAGINATE_BY } from "@dashboard/config";
import { UseListSettings } from "@dashboard/hooks/useListSettings";
import useLocalPageInfo from "@dashboard/hooks/useLocalPageInfo";
import { LocalPagination } from "@dashboard/hooks/useLocalPaginator";
import { useState } from "react";

import { VoucherCode } from "../../VoucherCodesDatagrid/types";

export interface UseVoucherCodesPagination {
  pagination: LocalPagination;
  paginatedCodes: VoucherCode[];
  onSettingsChange: UseListSettings["updateListSettings"];
  settings: UseListSettings["settings"];
}

export const useVoucherCodesPagination = (
  voucherCodes: VoucherCode[],
): UseVoucherCodesPagination => {
  const [codesPaginatedBy, setCodesPaginatedBy] = useState(PAGINATE_BY);
  const { loadNextPage, loadPreviousPage, pageInfo, pageValues } =
    useLocalPageInfo(voucherCodes, codesPaginatedBy);

  return {
    paginatedCodes: pageValues,
    settings: {
      rowNumber: codesPaginatedBy,
    },
    onSettingsChange: (key, value) => {
      if (key === "rowNumber") {
        setCodesPaginatedBy(value as number);
      }
    },
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
