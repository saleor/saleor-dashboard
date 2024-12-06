import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { SaleFragment, useSaleBulkDeleteMutation, useSaleListQuery } from "@dashboard/graphql";
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
import { commonMessages } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import SaleListPage from "../../components/SaleListPage";
import { saleListUrl, SaleListUrlDialog, SaleListUrlQueryParams } from "../../urls";
import { getFilterOpts, getFilterQueryParam, getFilterVariables, storageUtils } from "./filters";
import { canBeSorted, DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface SaleListProps {
  params: SaleListUrlQueryParams;
}

export const SaleList = ({ params }: SaleListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.SALES_LIST);

  usePaginationReset(saleListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { availableChannels } = useAppChannel(false);
  const selectedChannel = availableChannels.find(channel => channel.slug === params.channel);
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels, channel => channel.slug)
    : [];
  const [openModal, closeModal] = createDialogActionHandlers<
    SaleListUrlDialog,
    SaleListUrlQueryParams
  >(navigate, saleListUrl, params);
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
  const { data, loading, refetch } = useSaleListQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const sales: SaleFragment[] = mapEdgesToItems(data?.sales) ?? [];
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
    getPresetNameToDelete,
    selectedPreset,
    presets,
    setPresetIdToDelete,
  } = useFilterPresets({
    getUrl: saleListUrl,
    params,
    storageUtils,
    reset: clearRowSelection,
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: saleListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });

  useEffect(() => {
    if (!canBeSorted(params?.sort, !!selectedChannel)) {
      navigate(
        saleListUrl({
          ...params,
          sort: DEFAULT_SORT_KEY,
        }),
      );
    }
  }, [params]);

  const paginationValues = usePaginator({
    pageInfo: data?.sales?.pageInfo,
    paginationState,
    queryString: params,
  });
  const [saleBulkDelete, saleBulkDeleteOpts] = useSaleBulkDeleteMutation({
    onCompleted: data => {
      if (data?.saleBulkDelete?.errors?.length === 0) {
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
  const handleSort = createSortHandler(navigate, saleListUrl, params);
  const handleSelectSaleIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!sales) {
        return;
      }

      const rowsIds = rows
        .filter(row => typeof sales[row] !== "undefined")
        .map(row => sales[row].id);

      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [sales, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );
  const onSaleBulkDelete = async () => {
    await saleBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
    clearRowSelection();
  };

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(commonMessages.discounts)} />
      <SaleListPage
        currencySymbol={selectedChannel?.currencyCode}
        onSelectSaleIds={handleSelectSaleIds}
        filterOpts={getFilterOpts(params, channelOpts)}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={filter => changeFilters(filter)}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetChange={onPresetChange}
        onFilterPresetUpdate={onPresetUpdate}
        onFilterPresetsAll={resetFilters}
        filterPresets={presets.map(preset => preset.name)}
        selectedFilterPreset={selectedPreset}
        hasPresetsChanged={hasPresetsChanged}
        onSalesDelete={() => openModal("remove")}
        selectedSaleIds={selectedRowIds}
        sales={sales}
        settings={settings}
        disabled={loading}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        sort={getSortParams(params)}
        selectedChannelId={selectedChannel?.id ?? ""}
      />
      <ActionDialog
        confirmButtonState={saleBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={onSaleBulkDelete}
        open={params.action === "remove" && selectedRowIds.length > 0}
        title={intl.formatMessage({
          id: "ZWIjvr",
          defaultMessage: "Delete Sales",
          description: "dialog header",
        })}
        variant="delete"
      >
        <FormattedMessage
          id="FPzzh7"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this sale?} other{Are you sure you want to delete {displayQuantity} sales?}}"
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
export default SaleList;
