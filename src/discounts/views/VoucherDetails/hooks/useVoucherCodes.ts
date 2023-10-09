import useListSettings from "@dashboard/hooks/useListSettings";
import { ListViews } from "@dashboard/types";
import { useState } from "react";

import { getVoucherCodesToDisplay } from "../utils";
import { useVoucherCodesClient } from "./useVoucherCodesClient";
import { useVoucherCodesRowSelection } from "./useVoucherCodesRowSelection";
import { useVoucherCodesServer } from "./useVoucherCodesServer";

export const useVoucherCodes = ({ id }: { id: string }) => {
  const {
    settings: voucherCodesSettings,
    updateListSettings: updateVoucherCodesListSettings,
  } = useListSettings(ListViews.VOUCHER_CODES);

  const [isServerPagination, setIsServerPagination] = useState(true);

  const {
    addedVoucherCodes,
    clientVoucherCodes,
    clientVoucherCodesPagination,
    freeSlotsInClientPagianationPage,
    handleAddVoucherCode,
    handleGenerateMultipeCodes,
    hasClientPaginationNextPage,
    hasClientPaginationPrevPage,
    onSettingsChange,
  } = useVoucherCodesClient(voucherCodesSettings, () => {
    setIsServerPagination(false);
  });

  const {
    freeSlotsInServerPagianationPage,
    hasServerPaginationNextPage,
    hasServerPaginationPrevPage,
    serverVoucherCodesPagination,
    serverVoucherCodes,
    voucherCodesLoading,
    voucherCodesRefetch,
  } = useVoucherCodesServer({
    id,
    skipFetch: !isServerPagination && hasClientPaginationNextPage,
    settings: voucherCodesSettings,
    isServerPagination,
    paginationState: {
      first:
        !isServerPagination &&
        !hasClientPaginationNextPage &&
        freeSlotsInClientPagianationPage > 0
          ? freeSlotsInClientPagianationPage
          : undefined,
    },
  });

  const voucherCodes = getVoucherCodesToDisplay({
    addedVoucherCodes,
    clientVoucherCodes,
    freeSlotsInClientPagianationPage,
    hasClientPaginationNextPage,
    freeSlotsInServerPagianationPage,
    hasServerPaginationPrevPage,
    isServerPagination,
    serverVoucherCodes,
  });

  const voucherCodesPagination = isServerPagination
    ? serverVoucherCodesPagination
    : clientVoucherCodesPagination;

  const { selectedVoucherCodesIds, handleSetSelectedVoucherCodesIds } =
    useVoucherCodesRowSelection(voucherCodes);

  const handleLoadNextPage = () => {
    if (isServerPagination) {
      voucherCodesPagination.loadNextPage();
    } else {
      // Switch to server pagination
      if (clientVoucherCodes.length < voucherCodesSettings.rowNumber) {
        setIsServerPagination(true);
        serverVoucherCodesPagination.loadNextPage();
      } else {
        clientVoucherCodesPagination.loadNextPage();
      }
    }
  };

  const handleLoadPrevousPage = () => {
    if (!isServerPagination) {
      clientVoucherCodesPagination.loadPreviousPage();
    } else {
      // Switch to client pagination
      if (!hasServerPaginationPrevPage && addedVoucherCodes.length > 0) {
        clientVoucherCodesPagination.loadPreviousPage();
        setIsServerPagination(false);
      } else {
        voucherCodesPagination.loadPreviousPage();
      }
    }
  };

  return {
    voucherCodes,
    voucherCodesLoading,
    voucherCodesPagination: {
      ...voucherCodesPagination,
      pageInfo: {
        ...voucherCodesPagination.pageInfo,
        hasNextPage: isServerPagination
          ? hasServerPaginationNextPage
          : hasClientPaginationNextPage || hasServerPaginationNextPage,
        hasPreviousPage: !isServerPagination
          ? hasClientPaginationPrevPage
          : hasServerPaginationPrevPage || hasClientPaginationPrevPage,
      },
      loadNextPage: handleLoadNextPage,
      loadPreviousPage: handleLoadPrevousPage,
    },
    voucherCodesRefetch,
    voucherCodesSettings,
    updateVoucherCodesListSettings: (key: any, value: any) => {
      updateVoucherCodesListSettings(key, value);
      onSettingsChange(key, value);
    },
    selectedVoucherCodesIds,
    handleSetSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipeCodes,
  };
};
