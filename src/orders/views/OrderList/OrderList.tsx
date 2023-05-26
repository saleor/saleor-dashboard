import ChannelPickerDialog from "@dashboard/channels/components/ChannelPickerDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog, {
  SaveFilterTabDialogFormData,
} from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  useOrderDraftCreateMutation,
  useOrderListQuery,
} from "@dashboard/graphql";
import { useFilterHandlers } from "@dashboard/hooks/useFilterHandlers";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import {
  getActiveTabIndexAfterTabDelete,
  getNextUniqueTabName,
} from "@dashboard/products/views/ProductList/utils";
import { ListViews } from "@dashboard/types";
import { prepareQs } from "@dashboard/utils/filters/qs";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { stringify } from "qs";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import OrderListPage from "../../components/OrderListPage/OrderListPage";
import {
  orderListUrl,
  OrderListUrlDialog,
  OrderListUrlQueryParams,
  orderSettingsPath,
  orderUrl,
} from "../../urls";
import {
  deleteFilterTab,
  getFilterOpts,
  getFilterQueryParam,
  getFilterTabs,
  getFilterVariables,
  saveFilterTab,
  updateFilterTab,
} from "./filters";
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface OrderListProps {
  params: OrderListUrlQueryParams;
}

export const OrderList: React.FC<OrderListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(
    ListViews.ORDER_LIST,
  );

  const [tabIndexToDelete, setTabIndexToDelete] = useState<number | null>(null);

  usePaginationReset(orderListUrl, params, settings.rowNumber);

  const intl = useIntl();

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

  const noChannel = !channel && typeof channel !== "undefined";
  const channelOpts = availableChannels
    ? mapNodeToChoice(availableChannels)
    : null;

  const tabs = getFilterTabs();

  const currentTab =
    params.activeTab !== undefined ? parseInt(params.activeTab, 10) : undefined;

  const [changeFilters, resetFilters, handleSearchChange] = useFilterHandlers({
    createUrl: orderListUrl,
    getFilterQueryParam,
    params,
    defaultSortField: DEFAULT_SORT_KEY,
    hasSortWithRank: true,
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    OrderListUrlDialog,
    OrderListUrlQueryParams
  >(navigate, orderListUrl, params);

  const hasPresetsChanged = () => {
    const activeTab = tabs[currentTab - 1];
    const { paresedQs } = prepareQs(location.search);

    return (
      activeTab?.data !== stringify(paresedQs) &&
      location.search !== "" &&
      stringify(paresedQs) !== ""
    );
  };

  const handleTabChange = (tab: number) => {
    const qs = new URLSearchParams(getFilterTabs()[tab - 1]?.data ?? "");
    qs.append("activeTab", tab.toString());

    navigate(orderListUrl() + "?" + qs.toString());
  };

  const handleFilterTabDelete = () => {
    deleteFilterTab(tabIndexToDelete);

    // When deleting the current tab, navigate to the All orders tab
    if (tabIndexToDelete === currentTab) {
      navigate(orderListUrl());
    } else {
      const currentParams = { ...params };
      // When deleting a tab that is not the current one, only remove the action param from the query
      delete currentParams.action;
      // When deleting a tab that is before the current one, decrease the activeTab param by 1
      currentParams.activeTab = getActiveTabIndexAfterTabDelete(
        currentTab,
        tabIndexToDelete,
      );
      navigate(orderListUrl() + "?" + stringify(currentParams));
    }
  };

  const hanleFilterTabUpdate = (tabName: string) => {
    const { paresedQs, activeTab } = prepareQs(location.search);

    updateFilterTab(tabName, stringify(paresedQs));
    paresedQs.activeTab = activeTab;

    navigate(orderListUrl() + "?" + stringify(paresedQs));
  };

  const handleFilterTabSave = (data: SaveFilterTabDialogFormData) => {
    const { paresedQs } = prepareQs(location.search);

    saveFilterTab(
      getNextUniqueTabName(
        data.name,
        tabs.map(tab => tab.name),
      ),
      stringify(paresedQs),
    );
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
  const { data, loading } = useOrderListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const paginationValues = usePaginator({
    pageInfo: data?.orders?.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, orderListUrl, params);

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <OrderListPage
        settings={settings}
        currentTab={currentTab}
        disabled={loading}
        filterOpts={getFilterOpts(params, channelOpts)}
        limits={limitOpts.data?.shop.limits}
        orders={mapEdgesToItems(data?.orders)}
        sort={getSortParams(params)}
        onAdd={() => openModal("create-order")}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onTabSave={() => openModal("save-search")}
        onTabDelete={(tabIndex: number) => {
          setTabIndexToDelete(tabIndex);
          openModal("delete-search");
        }}
        onTabChange={handleTabChange}
        onTabUpdate={hanleFilterTabUpdate}
        initialSearch={params.query || ""}
        tabs={getFilterTabs().map(tab => tab.name)}
        onAll={resetFilters}
        onSettingsOpen={() => navigate(orderSettingsPath)}
        params={params}
        hasPresetsChanged={hasPresetsChanged()}
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
        tabName={tabs[tabIndexToDelete - 1]?.name ?? "..."}
      />
      {!noChannel && (
        <ChannelPickerDialog
          channelsChoices={channelOpts}
          confirmButtonState="success"
          defaultChoice={channel.id}
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
      )}
    </PaginatorContext.Provider>
  );
};

export default OrderList;
