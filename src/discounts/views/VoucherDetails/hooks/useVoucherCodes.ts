import { VOUCHER_CODE_DRAFT_STATUS } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";
import { useVoucherCodeBulkDeleteMutation } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationStatus } from "@dashboard/misc";
import { type ListSettings, ListViews } from "@dashboard/types";
import { useState } from "react";
import { useIntl } from "react-intl";

import { getVoucherCodesToDisplay } from "../utils";
import { useVoucherCodesClient } from "./useVoucherCodesClient";
import { useVoucherCodesRowSelection } from "./useVoucherCodesRowSelection";
import { useVoucherCodesServer } from "./useVoucherCodesServer";

export const useVoucherCodes = ({ id }: { id: string }) => {
  const notify = useNotifier();
  const intl = useIntl();
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

  const [voucherCodeBulkDelete, voucherCodeBulkDeleteOpts] = useVoucherCodeBulkDeleteMutation({
    onCompleted: data => {
      if (data.voucherCodeBulkDelete?.errors.length === 0) {
        voucherCodesRefetch();
      }
    },
  });

  const handleDeleteVoucherCodes = async () => {
    const draftCodes: string[] = [];
    const serverCodeIds: string[] = [];

    for (const codeValue of selectedVoucherCodesIds) {
      const found = voucherCodes.find(vc => vc.code === codeValue);

      if (found?.status === VOUCHER_CODE_DRAFT_STATUS) {
        draftCodes.push(codeValue);
      } else if (found?.id) {
        serverCodeIds.push(found.id);
      }
    }

    clearRowSelection();

    if (draftCodes.length > 0) {
      handleDeleteAddedVoucherCodes(draftCodes);
    }

    let serverDeletedCount = 0;

    if (serverCodeIds.length > 0) {
      const result = await voucherCodeBulkDelete({ variables: { ids: serverCodeIds } });
      const errors = result.data?.voucherCodeBulkDelete?.errors ?? [];

      if (errors.length > 0) {
        notify({
          status: "error",
          text: intl.formatMessage({
            id: "Y8XVvH",
            defaultMessage: "Failed to delete voucher codes",
          }),
        });

        return;
      }

      serverDeletedCount = result.data?.voucherCodeBulkDelete?.count ?? 0;
    }

    const totalDeleted = draftCodes.length + serverDeletedCount;

    if (totalDeleted > 0) {
      notify({
        status: "success",
        text: intl.formatMessage(
          {
            id: "TV940D",
            defaultMessage:
              "{count, plural, one {# voucher code deleted} other {# voucher codes deleted}}",
          },
          { count: totalDeleted },
        ),
      });
    }
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
    voucherCodesLoading,
    voucherCodesDeleteTransitionState: getMutationStatus(voucherCodeBulkDeleteOpts),
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
