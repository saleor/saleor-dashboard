// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import ChannelPickerDialog from "@dashboard/channels/components/ChannelPickerDialog";
import ActionDialog from "@dashboard/components/ActionDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  useOrderDraftBulkCancelMutation,
  useOrderDraftCreateMutation,
  useOrderDraftListQuery,
} from "@dashboard/graphql";
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
import { DialogContentText } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import React, { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderDraftListPage from "../../components/OrderDraftListPage";
import {
  orderDraftListUrl,
  OrderDraftListUrlDialog,
  OrderDraftListUrlQueryParams,
  orderUrl,
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFilterVariables,
  storageUtils,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface OrderDraftListProps {
  params: OrderDraftListUrlQueryParams;
}

export const OrderDraftList: React.FC<OrderDraftListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const { updateListSettings, settings } = useListSettings(
    ListViews.DRAFT_LIST,
  );

  usePaginationReset(orderDraftListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  const [orderDraftBulkDelete, orderDraftBulkDeleteOpts] =
    useOrderDraftBulkCancelMutation({
      onCompleted: data => {
        if (data.draftOrderBulkDelete.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage({
              id: "ra2O4j",
              defaultMessage: "Deleted draft orders",
            }),
          });
          refetch();
          clearRowSelection();
          closeModal();
        }
      },
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

  const [changeFilters, resetFilters, handleSearchChange] =
    createFilterHandlers({
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

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [paginationState, params],
  );
  const { data, loading, refetch } = useOrderDraftListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const orderDrafts = mapEdgesToItems(data?.draftOrders);

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.draftOrders.pageInfo),
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, orderDraftListUrl, params);

  const onOrderDraftBulkDelete = useCallback(async () => {
    await orderDraftBulkDelete({
      variables: {
        ids: selectedRowIds,
      },
    });
    clearRowSelection();
  }, []);

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
    [
      orderDrafts,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <OrderDraftListPage
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
        disabled={loading}
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
        onConfirm={onOrderDraftBulkDelete}
        open={params.action === "remove"}
        title={intl.formatMessage({
          id: "qbmeUI",
          defaultMessage: "Delete Order Drafts",
          description: "dialog header",
        })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            id="Q6VRrE"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this order draft?} other{Are you sure you want to delete {displayQuantity} order drafts?}}"
            description="dialog content"
            values={{
              counter: maybe(() => selectedRowIds.length),
              displayQuantity: (
                <strong>{maybe(() => selectedRowIds.length)}</strong>
              ),
            }}
          />
        </DialogContentText>
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
