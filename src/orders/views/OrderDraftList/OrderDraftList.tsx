import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ChannelPickerDialog from "@saleor/channels/components/ChannelPickerDialog";
import ActionDialog from "@saleor/components/ActionDialog";
import useAppChannel from "@saleor/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@saleor/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData
} from "@saleor/components/SaveFilterTabDialog";
import useBulkActions from "@saleor/hooks/useBulkActions";
import useListSettings from "@saleor/hooks/useListSettings";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderDraftListPage from "../../components/OrderDraftListPage";
import {
  TypedOrderDraftBulkCancelMutation,
  useOrderDraftCreateMutation
} from "../../mutations";
import { useOrderDraftListQuery } from "../../queries";
import { OrderDraftBulkCancel } from "../../types/OrderDraftBulkCancel";
import { OrderDraftCreate } from "../../types/OrderDraftCreate";
import {
  orderDraftListUrl,
  OrderDraftListUrlDialog,
  OrderDraftListUrlQueryParams,
  orderUrl
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterOpts,
  getFilterQueryParam,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface OrderDraftListProps {
  params: OrderDraftListUrlQueryParams;
}

export const OrderDraftList: React.FC<OrderDraftListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.DRAFT_LIST
  );
  const intl = useIntl();

  const handleCreateOrderCreateSuccess = (data: OrderDraftCreate) => {
    notify({
      status: "success",
      text: intl.formatMessage({
        defaultMessage: "Order draft successfully created"
      })
    });
    navigate(orderUrl(data.draftOrderCreate.order.id));
  };

  const [createOrder] = useOrderDraftCreateMutation({
    onCompleted: handleCreateOrderCreateSuccess
  });

  const { channel, availableChannels } = useAppChannel();

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab === undefined
      ? areFiltersApplied(params)
        ? tabs.length + 1
        : 0
      : parseInt(params.activeTab, 0);

  const [
    changeFilters,
    resetFilters,
    handleSearchChange
  ] = createFilterHandlers({
    cleanupFn: reset,
    createUrl: orderDraftListUrl,
    getFilterQueryParam,
    navigate,
    params
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
        ...getFilterTabs()[tab - 1].data
      })
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
      sort: getSortQueryVariables(params)
    }),
    [params]
  );
  const { data, loading, refetch } = useOrderDraftListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.draftOrders.pageInfo),
    paginationState,
    params
  );

  const handleOrderDraftBulkCancel = (data: OrderDraftBulkCancel) => {
    if (data.draftOrderBulkDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Deleted draft orders"
        })
      });
      refetch();
      reset();
      closeModal();
    }
  };

  const handleSort = createSortHandler(navigate, orderDraftListUrl, params);

  return (
    <>
      <TypedOrderDraftBulkCancelMutation
        onCompleted={handleOrderDraftBulkCancel}
      >
        {(orderDraftBulkDelete, orderDraftBulkDeleteOpts) => {
          const onOrderDraftBulkDelete = () =>
            orderDraftBulkDelete({
              variables: {
                ids: params.ids
              }
            });

          return (
            <>
              <OrderDraftListPage
                currentTab={currentTab}
                filterOpts={getFilterOpts(params)}
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
                orders={maybe(() =>
                  data.draftOrders.edges.map(edge => edge.node)
                )}
                pageInfo={pageInfo}
                onAdd={() => openModal("create-order")}
                onNextPage={loadNextPage}
                onPreviousPage={loadPreviousPage}
                onRowClick={id => () => navigate(orderUrl(id))}
                onSort={handleSort}
                onUpdateListSettings={updateListSettings}
                isChecked={isSelected}
                selected={listElements.length}
                sort={getSortParams(params)}
                toggle={toggle}
                toggleAll={toggleAll}
                toolbar={
                  <IconButton
                    color="primary"
                    onClick={() =>
                      openModal("remove", {
                        ids: listElements
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
                  defaultMessage: "Delete Order Drafts",
                  description: "dialog header"
                })}
                variant="delete"
              >
                <DialogContentText>
                  <FormattedMessage
                    defaultMessage="{counter,plural,one{Are you sure you want to delete this order draft?} other{Are you sure you want to delete {displayQuantity} order drafts?}}"
                    description="dialog content"
                    values={{
                      counter: maybe(() => params.ids.length),
                      displayQuantity: (
                        <strong>{maybe(() => params.ids.length)}</strong>
                      )
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
                channelsChoices={availableChannels.map(channel => ({
                  label: channel.name,
                  value: channel.id
                }))}
                confirmButtonState="success"
                defaultChoice={channel.id}
                open={params.action === "create-order"}
                onClose={closeModal}
                onConfirm={channel =>
                  createOrder({
                    variables: {
                      input: { channel }
                    }
                  })
                }
              />
            </>
          );
        }}
      </TypedOrderDraftBulkCancelMutation>
    </>
  );
};

export default OrderDraftList;
