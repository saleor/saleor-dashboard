// @ts-strict-ignore
import {
  extensionMountPoints,
  mapToMenuItemsForOrderListActions,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { useUserAccessibleChannels } from "@dashboard/auth/hooks/useUserAccessibleChannels";
import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { OrderListQuery, RefreshLimitsQuery } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { orderMessages } from "@dashboard/orders/messages";
import { DevModeQuery } from "@dashboard/orders/queries";
import { OrderListUrlQueryParams, OrderListUrlSortField, orderUrl } from "@dashboard/orders/urls";
import { getFilterVariables } from "@dashboard/orders/views/OrderList/filters";
import { FilterPageProps, PageListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { Card } from "@material-ui/core";
import { Box, Button, ChevronRightIcon, Tooltip } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import OrderLimitReached from "../OrderLimitReached";
import { OrderListDatagrid } from "../OrderListDatagrid";
import { createFilterStructure, OrderFilterKeys, OrderListFilterOpts } from "./filters";

export interface OrderListPageProps
  extends PageListProps,
    Omit<FilterPageProps<OrderFilterKeys, OrderListFilterOpts>, "onTabDelete">,
    SortPage<OrderListUrlSortField> {
  limits: RefreshLimitsQuery["shop"]["limits"];
  orders: RelayToFlat<OrderListQuery["orders"]>;
  hasPresetsChanged: boolean;
  onSettingsOpen: () => void;
  onAdd: () => void;
  params: OrderListUrlQueryParams;
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (tabIndex: number) => void;
}

const OrderListPage: React.FC<OrderListPageProps> = ({
  initialSearch,
  filterOpts,
  limits,
  onAdd,
  onSearchChange,
  onSettingsOpen,
  onFilterChange,
  params,
  onTabChange,
  onTabDelete,
  onTabSave,
  onTabUpdate,
  tabs,
  onAll,
  currentTab,
  hasPresetsChanged,
  ...listProps
}) => {
  const intl = useIntl();
  const userAccessibleChannels = useUserAccessibleChannels();
  const hasAccessibleChannels = userAccessibleChannels.length > 0;
  const filterStructure = createFilterStructure(intl, filterOpts);
  const limitsReached = isLimitReached(limits, "orders");
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const { ORDER_OVERVIEW_CREATE, ORDER_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.ORDER_LIST,
  );
  const extensionMenuItems = mapToMenuItemsForOrderListActions(ORDER_OVERVIEW_MORE_ACTIONS);
  const extensionCreateButtonItems = mapToMenuItemsForOrderListActions(ORDER_OVERVIEW_CREATE);
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(DevModeQuery);
    const variables = JSON.stringify(
      {
        filter: getFilterVariables(params),
        // TODO add sorting: Issue #3409
        // strange error when uncommenting this line
        // sortBy: getSortQueryVariables(params)
      },
      null,
      2,
    );
    context.setVariables(variables);
    context.setDevModeVisibility(true);
  };

  return (
    <ListPageLayout>
      <TopNav title={intl.formatMessage(sectionNames.orders)} withoutBorder isAlignToRight={false}>
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onTabUpdate}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage(orderMessages.filterPresetsAll)}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            {!!onSettingsOpen && (
              <TopNav.Menu
                items={[
                  {
                    label: intl.formatMessage({
                      id: "vEwjub",
                      defaultMessage: "Open in GraphiQL",
                      description: "button",
                    }),
                    onSelect: openPlaygroundURL,
                  },
                  {
                    label: intl.formatMessage({
                      id: "WbV1Xm",
                      defaultMessage: "Order Settings",
                      description: "button",
                    }),
                    onSelect: onSettingsOpen,
                  },
                  ...extensionMenuItems,
                ]}
              />
            )}

            <Tooltip>
              <Tooltip.Trigger>
                {extensionCreateButtonItems.length > 0 ? (
                  <ButtonWithDropdown
                    onClick={onAdd}
                    testId={"create-order-button"}
                    options={extensionCreateButtonItems}
                    disabled={limitsReached || !hasAccessibleChannels}
                  >
                    <FormattedMessage
                      id="LshEVn"
                      defaultMessage="Create order"
                      description="button"
                    />
                  </ButtonWithDropdown>
                ) : (
                  <Button
                    data-test-id="create-order-button"
                    onClick={onAdd}
                    disabled={limitsReached || !hasAccessibleChannels}
                  >
                    <FormattedMessage
                      id="LshEVn"
                      defaultMessage="Create order"
                      description="button"
                    />
                  </Button>
                )}
              </Tooltip.Trigger>
              <Tooltip.Content>
                {!hasAccessibleChannels && (
                  <FormattedMessage
                    defaultMessage="You don't have access to any channels"
                    id="grkY2V"
                  />
                )}
              </Tooltip.Content>
            </Tooltip>

            {hasLimits(limits, "orders") && (
              <LimitsInfo
                text={intl.formatMessage(
                  {
                    id: "zyceue",
                    defaultMessage: "{count}/{max} orders",
                    description: "placed order counter",
                  },
                  {
                    count: limits.currentUsage.orders,
                    max: limits.allowedUsage.orders,
                  },
                )}
              />
            )}
          </Box>
        </Box>
      </TopNav>
      {limitsReached && <OrderLimitReached />}
      <Card>
        <ListFilters
          initialSearch={initialSearch}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          filterStructure={filterStructure}
          searchPlaceholder={intl.formatMessage({
            id: "wTHjt3",
            defaultMessage: "Search Orders...",
          })}
        />
        <OrderListDatagrid {...listProps} hasRowHover={!isFilterPresetOpen} rowAnchor={orderUrl} />
      </Card>
    </ListPageLayout>
  );
};
OrderListPage.displayName = "OrderListPage";
export default OrderListPage;
