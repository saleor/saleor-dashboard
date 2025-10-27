// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import ChannelPickerDialog from "@dashboard/channels/components/ChannelPickerDialog";
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createDraftOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { useOrderDraftCreateMutation, useOrderDraftListQuery } from "@dashboard/graphql";
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
import { maybe } from "@dashboard/misc";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderDraftListPage from "../../components/OrderDraftListPage";
import {
  orderDraftListUrl,
  OrderDraftListUrlDialog,
  OrderDraftListUrlQueryParams,
  orderUrl,
} from "../../urls";
import { getFilterOpts, getFilterQueryParam, storageUtils } from "./filters";
import { getSortQueryVariables } from "./sort";
import { useBulkDeletion } from "./useBulkDeletion";

interface OrderDraftListProps {
  params: OrderDraftListUrlQueryParams;
}

const OrderDraftList = ({ params }: OrderDraftListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(ListViews.DRAFT_LIST);
  const { valueProvider } = useConditionalFilterContext();
  const filter = createDraftOrderQueryVariables(valueProvider.value);

  usePaginationReset(orderDraftListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);
  const { onOrderDraftBulkDelete, orderDraftBulkDeleteOpts } = useBulkDeletion(() => {
    refetch();
    clearRowSelection();
    closeModal();
  });
  const [createOrder] = useOrderDraftCreateMutation({
    onCompleted: data => {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "6udlH+",
          defaultMessage: "Order draft successfully created",
        }),
      });
      navigate(orderUrl(data.draftOrderCreate.order.id));
    },
  });
  const { channel } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];
  const limitOpts = useShopLimitsQuery({
    variables: {
      orders: true,
    },
  });
  const [changeFilters, resetFilters, handleSearchChange] = createFilterHandlers({
    cleanupFn: clearRowSelection,
    createUrl: orderDraftListUrl,
    getFilterQueryParam,
    navigate,
    params,
    keepActiveTab: true,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    OrderDraftListUrlDialog,
    OrderDraftListUrlQueryParams
  >(navigate, orderDraftListUrl, params);
  const {
    selectedPreset,
    presets,
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    setPresetIdToDelete,
    getPresetNameToDelete,
  } = useFilterPresets({
    params,
    reset: clearRowSelection,
    getUrl: orderDraftListUrl,
    storageUtils,
  });
  const paginationState = createPaginationState(settings.rowNumber, params);

  const newFiltersQueryVariables = useMemo(
    () => ({
      ...paginationState,
      filter: {
        ...filter,
        search: params.query,
      },
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber, valueProvider.value],
  );

  const { data, refetch } = useOrderDraftListQuery({
    displayLoader: true,
    variables: newFiltersQueryVariables,
  });
  const orderDrafts = mapEdgesToItems(data?.draftOrders);
  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.draftOrders.pageInfo),
    paginationState,
    queryString: params,
  });
  const handleSort = createSortHandler(navigate, orderDraftListUrl, params);
  const handleSetSelectedOrderDraftIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!orderDrafts) {
        return;
      }

      const rowsIds = rows.map(row => orderDrafts[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [orderDrafts, selectedRowIds, setClearDatagridRowSelectionCallback, setSelectedRowIds],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <OrderDraftListPage
        // @ts-expect-error - due to strict-ignores, this prop is not typed properly but it is passed.
        onRowClick={item => {
          navigate(orderUrl(item));
        }}
        selectedFilterPreset={selectedPreset}
        filterOpts={getFilterOpts(params)}
        limits={limitOpts.data?.shop.limits}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onFilterPresetsAll={resetFilters}
        onFilterPresetChange={onPresetChange}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetUpdate={onPresetUpdate}
        onFilterPresetPresetSave={() => openModal("save-search")}
        filterPresets={presets.map(tab => tab.name)}
        disabled={!data}
        settings={settings}
        orders={orderDrafts}
        onAdd={() => openModal("create-order")}
        onSort={handleSort}
        sort={getSortParams(params)}
        currencySymbol={channel?.currencyCode}
        hasPresetsChanged={hasPresetsChanged}
        onDraftOrdersDelete={() =>
          openModal("remove", {
            ids: selectedRowIds,
          })
        }
        onUpdateListSettings={(...props) => {
          clearRowSelection();
          updateListSettings(...props);
        }}
        selectedOrderDraftIds={selectedRowIds}
        onSelectOrderDraftIds={handleSetSelectedOrderDraftIds}
      />
      <ActionDialog
        confirmButtonState={orderDraftBulkDeleteOpts.status}
        onClose={closeModal}
        onConfirm={() => onOrderDraftBulkDelete(selectedRowIds)}
        open={params.action === "remove"}
        title={intl.formatMessage({
          id: "qbmeUI",
          defaultMessage: "Delete Order Drafts",
          description: "dialog header",
        })}
        variant="delete"
      >
        <FormattedMessage
          id="Q6VRrE"
          defaultMessage="{counter,plural,one{Are you sure you want to delete this order draft?} other{Are you sure you want to delete {displayQuantity} order drafts?}}"
          description="dialog content"
          values={{
            counter: maybe(() => selectedRowIds.length),
            displayQuantity: <strong>{maybe(() => selectedRowIds.length)}</strong>,
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
      <ChannelPickerDialog
        channelsChoices={mapNodeToChoice(channels)}
        confirmButtonState="success"
        defaultChoice={channel?.id}
        open={params.action === "create-order"}
        onClose={closeModal}
        onConfirm={channelId =>
          createOrder({
            variables: {
              input: { channelId },
            },
          })
        }
      />
    </PaginatorContext.Provider>
  );
};

export default OrderDraftList;
