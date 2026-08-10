import { VOUCHER_CODE_DRAFT_STATUS } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { voucherCodeExists } from "@dashboard/discounts/components/VoucherCreatePage/utils";
import useListSettings from "@dashboard/hooks/useListSettings";
import { type ListSettings, ListViews } from "@dashboard/types";
import { useMemo, useState } from "react";

import { getVoucherCodesToDisplay } from "../utils";
import { useVoucherCodesClient } from "./useVoucherCodesClient";
import { useVoucherCodesRowSelection } from "./useVoucherCodesRowSelection";
import { useVoucherCodesServer } from "./useVoucherCodesServer";

interface PendingRemovedVoucherCode {
  id: string;
  code: string;
}

export const useVoucherCodes = ({ id }: { id: string }) => {
  const { settings: voucherCodesSettings, updateListSettings: updateVoucherCodesListSettings } =
    useListSettings(ListViews.VOUCHER_CODES);
  const [isServerPagination, setIsServerPagination] = useState(true);
  const [pendingRemovedCodes, setPendingRemovedCodes] = useState<PendingRemovedVoucherCode[]>([]);
  const {
    addedVoucherCodes,
    clientVoucherCodes,
    clientVoucherCodesPagination,
    freeSlotsInClientPagianationPage,
    handleAddVoucherCode: addDraftVoucherCode,
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
  const pendingRemovedCodeIds = useMemo(
    () => pendingRemovedCodes.map(code => code.id),
    [pendingRemovedCodes],
  );
  const pendingRemovedIdSet = useMemo(
    () => new Set(pendingRemovedCodeIds),
    [pendingRemovedCodeIds],
  );
  const voucherCodes = getVoucherCodesToDisplay({
    clientVoucherCodes,
    freeSlotsInClientPagianationPage,
    hasClientPaginationNextPage,
    freeSlotsInServerPagianationPage,
    hasServerPaginationPrevPage,
    isServerPagination,
    serverVoucherCodes,
  }).filter(code => !code.id || !pendingRemovedIdSet.has(code.id));
  const voucherCodesPagination = isServerPagination
    ? serverVoucherCodesPagination
    : clientVoucherCodesPagination;
  const { selectedVoucherCodesIds, setSelectedVoucherCodesIds, clearRowSelection } =
    useVoucherCodesRowSelection();

  const handleClearPendingRemovedVoucherCodes = () => {
    setPendingRemovedCodes([]);
  };

  const handleClearStagedVoucherCodes = () => {
    handleClearAddedVoucherCodes();
    handleClearPendingRemovedVoucherCodes();
  };

  const handleAddVoucherCode = (code: string) => {
    const pendingMatch = pendingRemovedCodes.find(
      pending => pending.code.toLowerCase() === code.toLowerCase(),
    );

    // Re-adding a staged-for-delete code cancels the pending remove (catalogue pattern).
    if (pendingMatch) {
      setPendingRemovedCodes(codes => codes.filter(pending => pending.id !== pendingMatch.id));

      return;
    }

    // Reject against drafts and already-saved codes on this page (API would fail on save).
    if (voucherCodeExists(code, voucherCodes) || voucherCodeExists(code, serverVoucherCodes)) {
      throw new Error("Code already exists");
    }

    addDraftVoucherCode(code);
  };

  const handleDeleteVoucherCodes = async (): Promise<boolean> => {
    const draftCodes: string[] = [];
    const serverCodesToRemove: PendingRemovedVoucherCode[] = [];

    for (const codeValue of selectedVoucherCodesIds) {
      const found = voucherCodes.find(vc => vc.code === codeValue);

      if (found?.status === VOUCHER_CODE_DRAFT_STATUS) {
        draftCodes.push(codeValue);
      } else if (found?.id) {
        serverCodesToRemove.push({ id: found.id, code: found.code });
      }
    }

    clearRowSelection();

    if (draftCodes.length > 0) {
      handleDeleteAddedVoucherCodes(draftCodes);
    }

    if (serverCodesToRemove.length > 0) {
      setPendingRemovedCodes(codes => {
        const existingIds = new Set(codes.map(code => code.id));
        const next = serverCodesToRemove.filter(code => !existingIds.has(code.id));

        return next.length > 0 ? [...codes, ...next] : codes;
      });
    }

    return true;
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
    pendingRemovedCodeIds,
    voucherCodesLoading,
    // Staging is sync — no live mutation on confirm.
    voucherCodesDeleteTransitionState: "default" as const,
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
    setSelectedVoucherCodesIds,
    handleAddVoucherCode,
    handleGenerateMultipleCodes,
    handleDeleteVoucherCodes,
    handleClearStagedVoucherCodes,
  };
};
