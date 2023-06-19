import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { OrderDraftListQuery, RefreshLimitsQuery } from "@dashboard/graphql";
import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";
import {
  FilterPageProps,
  PageListProps,
  RelayToFlat,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { isLimitReached } from "@dashboard/utils/limits";
import { Card } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { OrderDraftListDatagrid } from "../OrderDraftListDatagrid";
import { OrderDraftListDeleteButton } from "../OrderDraftListDeleteButton";
import { OrderDraftListHeader } from "../OrderDraftListHeader/OrderDraftListHeader";
import OrderLimitReached from "../OrderLimitReached";
import {
  createFilterStructure,
  OrderDraftFilterKeys,
  OrderDraftListFilterOpts,
} from "./filters";

export interface OrderDraftListPageProps
  extends PageListProps,
    Omit<
      FilterPageProps<OrderDraftFilterKeys, OrderDraftListFilterOpts>,
      "onTabDelete"
    >,
    SortPage<OrderDraftListUrlSortField>,
    Omit<TabPageProps, "onTabDelete"> {
  limits: RefreshLimitsQuery["shop"]["limits"];
  orders: RelayToFlat<OrderDraftListQuery["draftOrders"]>;
  selectedOrderDraftIds: string[];
  hasPresetsChanged: () => boolean;
  onAdd: () => void;
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (tabIndex: number) => void;
  onDraftOrdersDelete: () => void;
  onSelectOrderDraftIds: (ids: number[], clearSelection: () => void) => void;
}

const OrderDraftListPage: React.FC<OrderDraftListPageProps> = ({
  currentTab,
  disabled,
  filterOpts,
  initialSearch,
  limits,
  onAdd,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabUpdate,
  onTabSave,
  tabs,
  hasPresetsChanged,
  onDraftOrdersDelete,
  onFilterAttributeFocus,
  currencySymbol,
  selectedOrderDraftIds,
  ...listProps
}) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const filterStructure = createFilterStructure(intl, filterOpts);
  const limitsReached = isLimitReached(limits, "orders");

  return (
    <>
      <OrderDraftListHeader
        disabled={disabled}
        currentTab={currentTab}
        hasPresetsChanged={hasPresetsChanged()}
        isFilterPresetOpen={isFilterPresetOpen}
        setFilterPresetOpen={setFilterPresetOpen}
        limits={limits}
        onAdd={onAdd}
        onAll={onAll}
        onTabChange={onTabChange}
        onTabDelete={onTabDelete}
        onTabSave={onTabSave}
        onTabUpdate={onTabUpdate}
        tabs={tabs}
      />

      {limitsReached && <OrderLimitReached />}

      <Card>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <ListFilters
            currencySymbol={currencySymbol}
            initialSearch={initialSearch}
            onFilterChange={onFilterChange}
            onFilterAttributeFocus={onFilterAttributeFocus}
            onSearchChange={onSearchChange}
            filterStructure={filterStructure}
            searchPlaceholder={intl.formatMessage({
              id: "IzECoP",
              defaultMessage: "Search draft orders...",
            })}
            actions={
              <Box display="flex" gap={4}>
                {selectedOrderDraftIds.length > 0 && (
                  <OrderDraftListDeleteButton onClick={onDraftOrdersDelete}>
                    {intl.formatMessage({
                      id: "YJ2uRR",
                      defaultMessage: "Bulk delete draft orders",
                    })}
                  </OrderDraftListDeleteButton>
                )}
              </Box>
            }
          />
        </Box>

        <OrderDraftListDatagrid
          disabled={disabled}
          hasRowHover={!isFilterPresetOpen}
          {...listProps}
        />
      </Card>
    </>
  );
};
OrderDraftListPage.displayName = "OrderDraftListPage";
export default OrderDraftListPage;
