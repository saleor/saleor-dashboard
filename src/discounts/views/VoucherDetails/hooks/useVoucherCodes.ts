import useListSettings from "@dashboard/hooks/useListSettings";
import { ListSettings, ListViews } from "@dashboard/types";
import { useState } from "react";

import { getVoucherCodesToDisplay } from "../utils";
import { useVoucherCodesClient } from "./useVoucherCodesClient";
import { useVoucherCodesRowSelection } from "./useVoucherCodesRowSelection";
import { useVoucherCodesServer } from "./useVoucherCodesServer";

export const useVoucherCodes = ({ id }: { id: string }) => {
  const { settings: voucherCodesSettings, updateListSettings: updateVoucherCodesListSettings } =
    useListSettings(ListViews.VOUCHER_CODES);
  const [isServerPagination, setIsServerPagination] = useState(true);
  const {
    addedVoucherCodes,
    clientVoucherCodes,
    clientVoucherCodesPagination,
    freeSlotsInClientPagianationPage,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteAddedVoucherCodes,
    handleClearAddedVoucherCodes,
    hasClientPaginationNextPage,
    hasClientPaginationPrevPage,
    onSettingsChange,
  } = useVoucherCodesClient(voucherCodesSettings, () => {
    clearRowSelection();
    setIsServerPagination(false);
    restartServerPagination();
  });
  const {
    freeSlotsInServerPagianationPage,
    hasServerPaginationNextPage,
    hasServerPaginationPrevPage,
    serverVoucherCodesPagination,
    serverVoucherCodes,
    voucherCodesLoading,
    voucherCodesRefetch,
    restartServerPagination,
  } = useVoucherCodesServer({
    id,
    settings: voucherCodesSettings,
    skipFetch:
      !isServerPagination && freeSlotsInClientPagianationPage === 0 && hasClientPaginationNextPage,
    isServerPagination,
    paginationState: {
      first:
        !isServerPagination && freeSlotsInClientPagianationPage > 0
          ? freeSlotsInClientPagianationPage
          : voucherCodesSettings.rowNumber,
    },
  });
  const voucherCodes = getVoucherCodesToDisplay({
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
  const { selectedVoucherCodesIds, handleSetSelectedVoucherCodesIds, clearRowSelection } =
    useVoucherCodesRowSelection(voucherCodes);
  const handleDeleteVoucherCodes = () => {
    clearRowSelection();
    handleDeleteAddedVoucherCodes(selectedVoucherCodesIds);
  };
  const handleUpdateVoucherCodesListSettings = (
    key: keyof ListSettings<ListViews.VOUCHER_CODES>,
    value: number | string[],
  ) => {
    if (addedVoucherCodes.length > 0 && isServerPagination) {
      setIsServerPagination(false);
    }

    restartServerPagination();
    updateVoucherCodesListSettings(key, value);
    onSettingsChange(key, value);
  };
  const handleLoadNextPage = () => {
    clearRowSelection();

    if (isServerPagination) {
      serverVoucherCodesPagination.loadNextPage();
    }

    if (!isServerPagination) {
      if (!hasClientPaginationNextPage) {
        setIsServerPagination(true);
      }

      if (freeSlotsInClientPagianationPage > 0 && !hasClientPaginationNextPage) {
        serverVoucherCodesPagination.loadNextPage();
      }
    }

    clientVoucherCodesPagination.loadNextPage();
  };
  const handleLoadPrevousPage = () => {
    clearRowSelection();

    if (isServerPagination) {
      if (hasServerPaginationPrevPage) {
        serverVoucherCodesPagination.loadPreviousPage();
      } else {
        clientVoucherCodesPagination.loadPreviousPage();
        setIsServerPagination(false);
      }
    }

    clientVoucherCodesPagination.loadPreviousPage();
  };
  const calculateHasNextPage = () => {
    // In case when client voucher codes takes all slots
    // on page and there are some server voucher codes to display
    if (
      !isServerPagination &&
      !hasClientPaginationNextPage &&
      freeSlotsInClientPagianationPage === 0 &&
      serverVoucherCodes.length > 0
    ) {
      return true;
    }

    return hasClientPaginationNextPage || hasServerPaginationNextPage;
  };
  const calculateHasPrevPage = () => {
    if (isServerPagination) {
      return hasServerPaginationPrevPage || hasClientPaginationPrevPage;
    }

    return hasClientPaginationPrevPage;
  };

  return {
    voucherCodes,
    addedVoucherCodes,
    voucherCodesLoading,
    voucherCodesPagination: {
      ...voucherCodesPagination,
      pageInfo: {
        ...voucherCodesPagination.pageInfo,
        hasNextPage: calculateHasNextPage(),
        hasPreviousPage: calculateHasPrevPage(),
      },
      loadNextPage: handleLoadNextPage,
      loadPreviousPage: handleLoadPrevousPage,
    },
    voucherCodesRefetch,
    voucherCodesSettings,
    updateVoucherCodesListSettings: handleUpdateVoucherCodesListSettings,
    selectedVoucherCodesIds,
    handleSetSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteVoucherCodes,
    handleClearAddedVoucherCodes,
  };
};
