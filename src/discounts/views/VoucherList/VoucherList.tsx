// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { useVoucherBulkDeleteMutation, useVoucherListQuery } from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import VoucherListPage from "../../components/VoucherListPage";
import { voucherListUrl, VoucherListUrlDialog, VoucherListUrlQueryParams } from "../../urls";
import { getFilterOpts, getFilterQueryParam, getFilterVariables, storageUtils } from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface VoucherListProps {
  params: VoucherListUrlQueryParams;
}

export const VoucherList: React.FC<VoucherListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.VOUCHER_LIST);

  usePaginationReset(voucherListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { availableChannels } = useAppChannel(false);
  const selectedChannel = availableChannels.find(channel => channel.slug === params.channel);
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : null;
  const [openModal, closeModal] = createDialogActionHandlers<
    VoucherListUrlDialog,
    VoucherListUrlQueryParams
  >(navigate, voucherListUrl, params);
  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
      channel: params.channel,
    }),
    [params, settings.rowNumber],
  );
  const { data, refetch } = useVoucherListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const {
    clearRowSelection,
    selectedRowIds,
    setSelectedRowIds,
    setClearDatagridRowSelectionCallback,
  } = useRowSelection(params);
  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    selectedPreset,
    presets,
    getPresetNameToDelete,
    setPresetIdToDelete,
  } = useFilterPresets({
    getUrl: voucherListUrl,
    params,
    storageUtils,
    reset: clearRowSelection,
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: voucherListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });

  useEffect(() => {
    if (!canBeSorted(params.sort, !!selectedChannel)) {
      navigate(
        voucherListUrl({
          ...params,
          sort: DEFAULT_SORT_KEY,
        }),
      );
    }
  }, [params]);

  const paginationValues = usePaginator({
    pageInfo: data?.vouchers?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [voucherBulkDelete, voucherBulkDeleteOpts] = useVoucherBulkDeleteMutation({
    onCompleted: data => {
      if (data.voucherBulkDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        clearRowSelection();
        closeModal();
        refetch();
      }
    },
  });
  const onVoucherBulkDelete = async () => {
    await voucherBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
    clearRowSelection();
  };
  const handleSort = createSortHandler(navigate, voucherListUrl, params);
  const vouchers = mapEdgesToItems(data?.vouchers) ?? [];
  const handleSelectVouchersIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!vouchers) {
        return;
      }

      const rowsIds = rows.map(row => vouchers[row]?.id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [vouchers, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.vouchers)} />
      <VoucherListPage
        onSelectVouchersIds={handleSelectVouchersIds}
        filterOpts={getFilterOpts(params, channelOpts)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={filter => changeFilters(filter)}
        onFilterPresetsAll={resetFilters}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetChange={onPresetChange}
        onFilterPresetUpdate={onPresetUpdate}
        hasPresetsChanged={hasPresetsChanged}
        onVoucherDelete={() => openModal("remove")}
        selectedFilterPreset={selectedPreset}
        selectedVouchersIds={selectedRowIds}
        currencySymbol={selectedChannel?.currencyCode}
        filterPresets={presets.map(tab => tab.name)}
        settings={settings}
        vouchers={vouchers}
        disabled={!data}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        sort={getSortParams(params)}
        selectedChannelId={selectedChannel?.id}
      />
      <ActionDialog
        confirmButtonState={voucherBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={onVoucherBulkDelete}
        open={params.action === "remove" && selectedRowIds.length > 0}
        title={intl.formatMessage({
          id: "Q0JJ4F",
          defaultMessage: "Delete Vouchers",
          description: "dialog header",
        })}
        variant="delete"
      >
        <FormattedMessage
          id="O9QPe1"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this voucher?} other{Are you sure you want to delete {displayQuantity} vouchers?}}"
          description="dialog content"
          values={{
            counter: selectedRowIds.length,
            displayQuantity: <strong>{selectedRowIds.length}</strong>,
          }}
        />
      </ActionDialog>
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </PaginatorContext.Provider>
  );
};
export default VoucherList;
