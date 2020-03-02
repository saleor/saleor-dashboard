import Button from "@material-ui/core/Button";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
import useShop from "@saleor/hooks/useShop";
import { maybe } from "@saleor/misc";
import { ListViews } from "@saleor/types";
import createSortHandler from "@saleor/utils/handlers/sortHandler";
import { getSortParams } from "@saleor/utils/sort";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@saleor/utils/handlers/filterHandlers";
import OrderBulkCancelDialog from "../../components/OrderBulkCancelDialog";
import OrderListPage from "../../components/OrderListPage/OrderListPage";
import {
  TypedOrderBulkCancelMutation,
  useOrderDraftCreateMutation
} from "../../mutations";
import { useOrderListQuery } from "../../queries";
import { OrderBulkCancel } from "../../types/OrderBulkCancel";
import { OrderDraftCreate } from "../../types/OrderDraftCreate";
import {
  orderListUrl,
  OrderListUrlQueryParams,
  orderUrl,
  OrderListUrlDialog
} from "../../urls";
import {
  areFiltersApplied,
  deleteFilterTab,
  getActiveFilters,
  getFilterTabs,
  getFilterOpts,
  getFilterVariables,
  saveFilterTab,
  getFilterQueryParam
} from "./filters";
import { getSortQueryVariables } from "./sort";

interface OrderListProps {
  params: OrderListUrlQueryParams;
}

export const OrderList: React.FC<OrderListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const paginate = usePaginator();
  const shop = useShop();
  const { isSelected, listElements, reset, toggle, toggleAll } = useBulkActions(
    params.ids
  );
  const { updateListSettings, settings } = useListSettings(
    ListViews.ORDER_LIST
  );
  const intl = useIntl();

  const handleCreateOrderCreateSuccess = (data: OrderDraftCreate) => {
    notify({
      text: intl.formatMessage({
        defaultMessage: "Order draft successfully created"
      })
    });
    navigate(orderUrl(data.draftOrderCreate.order.id));
  };

  const [createOrder] = useOrderDraftCreateMutation({
    onCompleted: handleCreateOrderCreateSuccess
  });

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
    createUrl: orderListUrl,
    getFilterQueryParam,
    navigate,
    params
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    OrderListUrlDialog,
    OrderListUrlQueryParams
  >(navigate, orderListUrl, params);

  const handleTabChange = (tab: number) => {
    reset();
    navigate(
      orderListUrl({
        activeTab: tab.toString(),
        ...getFilterTabs()[tab - 1].data
      })
    );
  };

  const handleFilterTabDelete = () => {
    deleteFilterTab(currentTab);
    reset();
    navigate(orderListUrl());
  };

  const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
    saveFilterTab(data.name, getActiveFilters(params));
    handleTabChange(tabs.length + 1);
  };

  const paginationState = createPaginationState(settings.rowNumber, params);
  const currencySymbol = maybe(() => shop.defaultCurrency, "USD");

  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params)
    }),
    [params, settings.rowNumber]
  );
  const { data, loading, refetch } = useOrderListQuery({
    displayLoader: true,
    variables: queryVariables
  });

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    maybe(() => data.orders.pageInfo),
    paginationState,
    params
  );

  const handleOrderBulkCancel = (data: OrderBulkCancel) => {
    if (data.orderBulkCancel.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Orders cancelled"
        })
      });
      reset();
      refetch();
      closeModal();
    }
  };

  const handleSort = createSortHandler(navigate, orderListUrl, params);

  return (
    <TypedOrderBulkCancelMutation onCompleted={handleOrderBulkCancel}>
      {(orderBulkCancel, orderBulkCancelOpts) => {
        const onOrderBulkCancel = (restock: boolean) =>
          orderBulkCancel({
            variables: {
              ids: params.ids,
              restock
            }
          });

        return (
          <>
            <OrderListPage
              currencySymbol={currencySymbol}
              settings={settings}
              currentTab={currentTab}
              disabled={loading}
              filterOpts={getFilterOpts(params)}
              orders={maybe(() => data.orders.edges.map(edge => edge.node))}
              pageInfo={pageInfo}
              sort={getSortParams(params)}
              onAdd={createOrder}
              onNextPage={loadNextPage}
              onPreviousPage={loadPreviousPage}
              onUpdateListSettings={updateListSettings}
              onRowClick={id => () => navigate(orderUrl(id))}
              onSort={handleSort}
              isChecked={isSelected}
              selected={listElements.length}
              toggle={toggle}
              toggleAll={toggleAll}
              toolbar={
                <Button
                  color="primary"
                  onClick={() =>
                    openModal("cancel", {
                      ids: listElements
                    })
                  }
                >
                  <FormattedMessage
                    defaultMessage="Cancel"
                    description="cancel orders, button"
                  />
                </Button>
              }
              onSearchChange={handleSearchChange}
              onFilterChange={changeFilters}
              onTabSave={() => openModal("save-search")}
              onTabDelete={() => openModal("delete-search")}
              onTabChange={handleTabChange}
              initialSearch={params.query || ""}
              tabs={getFilterTabs().map(tab => tab.name)}
              onAll={resetFilters}
            />
            <OrderBulkCancelDialog
              confirmButtonState={orderBulkCancelOpts.status}
              numberOfOrders={maybe(() => params.ids.length.toString(), "...")}
              onClose={closeModal}
              onConfirm={onOrderBulkCancel}
              open={params.action === "cancel"}
            />
            <SaveFilterTabDialog
              open={params.action === "save-search"}
              confirmButtonState="default"
              onClose={closeModal}
              onSubmit={handleFilterTabSave}
            />
            <DeleteFilterTabDialog
              open={params.action === "delete-search"}
              confirmButtonState="default"
              onClose={closeModal}
              onSubmit={handleFilterTabDelete}
              tabName={maybe(() => tabs[currentTab - 1].name, "...")}
            />
          </>
        );
      }}
    </TypedOrderBulkCancelMutation>
  );
};

export default OrderList;
