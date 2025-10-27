// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import ChannelPickerDialog from "@dashboard/channels/components/ChannelPickerDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter";
import { createOrderQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import { useOrderDraftCreateMutation, useOrderListQuery } from "@dashboard/graphql";
import { useFilterHandlers } from "@dashboard/hooks/useFilterHandlers";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { useEffect, useMemo } from "react";
import { useIntl } from "react-intl";

import OrderListPage from "../../components/OrderListPage/OrderListPage";
import {
  orderListUrl,
  OrderListUrlDialog,
  OrderListUrlQueryParams,
  orderSettingsPath,
  orderUrl,
} from "../../urls";
import { getFilterQueryParam, storageUtils } from "./filters";
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";

interface OrderListProps {
  params: OrderListUrlQueryParams;
}

const OrderList = ({ params }: OrderListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(ListViews.ORDER_LIST);
  const { valueProvider } = useConditionalFilterContext();

  const { markOnboardingStepAsCompleted } = useOnboarding();

  useEffect(() => {
    markOnboardingStepAsCompleted("explore-orders");
  }, []);

  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    getPresetNameToDelete,
    presets,
    selectedPreset,
    setPresetIdToDelete,
  } = useFilterPresets({
    params,
    getUrl: orderListUrl,
    storageUtils,
    reset: () => undefined,
  });

  usePaginationReset(orderListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { channel, availableChannels } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];
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
  const limitOpts = useShopLimitsQuery({
    variables: {
      orders: true,
    },
  });
  const noChannel = !channel && typeof channel !== "undefined";
  const channelOpts = availableChannels ? mapNodeToChoice(channels) : null;
  const [_, resetFilters, handleSearchChange] = useFilterHandlers({
    createUrl: orderListUrl,
    getFilterQueryParam,
    params,
    defaultSortField: DEFAULT_SORT_KEY,
    hasSortWithRank: true,
    keepActiveTab: true,
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    OrderListUrlDialog,
    OrderListUrlQueryParams
  >(navigate, orderListUrl, params);
  const paginationState = createPaginationState(settings.rowNumber, params);
  const filterVariables = createOrderQueryVariables(valueProvider.value);

  const queryVariables = useMemo(
    () => ({
      ...paginationState,
      where: filterVariables,
      search: params.query,
      sort: getSortQueryVariables(params),
    }),
    // This is intentional - if we change deps array, we will make query
    // on each character change in filters, NOT when user clicks "SAVE"
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, settings.rowNumber, valueProvider.value],
  );
  const { data } = useOrderListQuery({
    displayLoader: true,
    skip: valueProvider.loading,
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
        // @ts-expect-error - due to strict-ignores, this prop is not typed properly but it is passed.
        onRowClick={item => {
          navigate(orderUrl(item));
        }}
        settings={settings}
        currentTab={selectedPreset}
        disabled={!data}
        limits={limitOpts.data?.shop.limits}
        orders={mapEdgesToItems(data?.orders)}
        sort={getSortParams(params)}
        onAdd={() => openModal("create-order")}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        onSearchChange={handleSearchChange}
        onTabSave={() => openModal("save-search")}
        onTabDelete={(tabIndex: number) => {
          setPresetIdToDelete(tabIndex);
          openModal("delete-search");
        }}
        onTabChange={onPresetChange}
        onTabUpdate={onPresetUpdate}
        initialSearch={params.query || ""}
        tabs={presets.map(tab => tab.name)}
        onAll={resetFilters}
        onSettingsOpen={() => navigate(orderSettingsPath)}
        params={params}
        hasPresetsChanged={hasPresetsChanged()}
      />
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
