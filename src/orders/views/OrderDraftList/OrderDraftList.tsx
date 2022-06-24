import { DialogContentText } from "@material-ui/core";
import ChannelPickerDialog from "@saleor/channels/components/ChannelPickerDialog";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@saleor/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@saleor/components/Shop/queries";
import {
  useOrderDraftBulkCancelMutation,
  useOrderDraftCreateMutation,
  useOrderDraftListQuery,
} from "@saleor/graphql";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { usePaginationReset } from "@saleor/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@saleor/hooks/usePaginator";
import { DeleteIcon, IconButton } from "@saleor/macaw-ui";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@saleor/utils/maps";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderDraftListPage from "../../components/OrderDraftListPage";
import {
  orderDraftListUrl,
  OrderDraftListUrlDialog,
  OrderDraftListUrlQueryParams,
  orderUrl,
} from "../../urls";
import {
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFiltersCurrentTab,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface OrderDraftListProps {
  params: OrderDraftListUrlQueryParams;
}

export const OrderDraftList: React.FC<OrderDraftListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids,
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.DRAFT_LIST,
  );

  usePaginationReset(orderDraftListUrl, params, settings.rowNumber);

  const intl = useIntl();

  const [
    orderDraftBulkDelete,
    orderDraftBulkDeleteOpts,
  ] = useOrderDraftBulkCancelMutation({
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
        reset();
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

  const { channel, availableChannels } = useAppChannel(false);
  const limitOpts = useShopLimitsQuery({
    variables: {
      orders: true,
    },
  });

  const tabs = getFilterTabs();

  const currentTab = getFiltersCurrentTab(params, tabs);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange,
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: orderDraftListUrl,
    getFilterQueryParam,
    navigate,
    params,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    OrderDraftListUrlDialog,
    OrderDraftListUrlQueryParams
  >(navigate, orderDraftListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      orderDraftListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data,
      }),
    );
  };

  const handleTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(orderDraftListUrl());
  };

  const handleTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useOrderDraftListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const paginationValues = usePaginator({
    pageInfo: maybe(() => data.draftOrders.pageInfo),
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, orderDraftListUrl, params);

  const onOrderDraftBulkDelete = () =>
    orderDraftBulkDelete({
      variables: {
        ids: params.ids,
      },
    });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <OrderDraftListPage
        currentTab={currentTab}
        filterOpts={getFilterOpts(params)}
        limits={limitOpts.data?.shop.limits}
        initialSearch={params.query || ""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onAll={resetFilters}
        onTabChange={handleTabChange}
        onTabDelete={() => openModal("delete-search")}
        onTabSave={() => openModal("save-search")}
        tabs={tabs.map(tab => tab.name)}
        disabled={loading}
        settings={settings}
        orders={mapEdgesToItems(data?.draftOrders)}
        onAdd={() => openModal("create-order")}
        onSort={handleSort}
        onUpdateListSettings={updateListSettings}
        isChecked={isSelected}
        selected={listElements.length}
        sort={getSortParams(params)}
        toggle={toggle}
        toggleAll={toggleAll}
        toolbar={
          <IconButton
            variant="secondary"
            color="primary"
            onClick={() =>
              openModal("remove", {
                ids: listElements,
              })
            }
          >
            <DeleteIcon />
          </IconButton>
        }
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
              counter: maybe(() => params.ids.length),
              displayQuantity: (
                <strong>{maybe(() => params.ids.length)}</strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleTabSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={handleTabDelete}
        tabName={maybe(() => tabs[currentTab - 1].name, "...")}
      />
      <ChannelPickerDialog
        channelsChoices={mapNodeToChoice(availableChannels)}
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
