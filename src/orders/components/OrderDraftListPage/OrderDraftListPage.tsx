// @ts-strict-ignore
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { DashboardCard } from "@dashboard/components/Card";
import { OrderDraftListQuery, RefreshLimitsQuery } from "@dashboard/graphql";
import { OrderDraftListUrlSortField } from "@dashboard/orders/urls";
import { FilterPagePropsWithPresets, PageListProps, RelayToFlat, SortPage } from "@dashboard/types";
import { isLimitReached } from "@dashboard/utils/limits";
import { Box } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { OrderDraftListDatagrid } from "../OrderDraftListDatagrid";
import { OrderDraftListHeader } from "../OrderDraftListHeader/OrderDraftListHeader";
import OrderLimitReached from "../OrderLimitReached";
import { OrderDraftFilterKeys, OrderDraftListFilterOpts } from "./filters";

interface OrderDraftListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<OrderDraftFilterKeys, OrderDraftListFilterOpts>,
    SortPage<OrderDraftListUrlSortField> {
  limits: RefreshLimitsQuery["shop"]["limits"];
  orders: RelayToFlat<OrderDraftListQuery["draftOrders"]>;
  selectedOrderDraftIds: string[];
  hasPresetsChanged: () => boolean;
  onAdd: () => void;
  onDraftOrdersDelete: () => void;
  onSelectOrderDraftIds: (ids: number[], clearSelection: () => void) => void;
}

const OrderDraftListPage = ({
  selectedFilterPreset,
  disabled,
  initialSearch,
  limits,
  onAdd,
  onFilterPresetsAll,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetDelete,
  onFilterPresetUpdate,
  onFilterPresetPresetSave,
  filterPresets,
  hasPresetsChanged,
  onDraftOrdersDelete,
  selectedOrderDraftIds,
  ...listProps
}: OrderDraftListPageProps) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const limitsReached = isLimitReached(limits, "orders");

  return (
    <>
      <OrderDraftListHeader
        disabled={disabled}
        selectedFilterPreset={selectedFilterPreset}
        hasPresetsChanged={hasPresetsChanged}
        isFilterPresetOpen={isFilterPresetOpen}
        setFilterPresetOpen={setFilterPresetOpen}
        limits={limits}
        onAdd={onAdd}
        onFilterPresetsAll={onFilterPresetsAll}
        onFilterPresetDelete={onFilterPresetDelete}
        onFilterPresetChange={onFilterPresetChange}
        onFilterPresetPresetSave={onFilterPresetPresetSave}
        onFilterPresetUpdate={onFilterPresetUpdate}
        filterPresets={filterPresets}
        selectedOrderDraftIds={selectedOrderDraftIds}
      />

      {limitsReached && <OrderLimitReached />}

      <DashboardCard>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="stretch"
          justifyContent="space-between"
        >
          <ListFilters
            type="expression-filter"
            initialSearch={initialSearch}
            onSearchChange={onSearchChange}
            searchPlaceholder={intl.formatMessage({
              id: "IzECoP",
              defaultMessage: "Search draft orders...",
            })}
            actions={
              <Box display="flex" gap={4}>
                {selectedOrderDraftIds.length > 0 && (
                  <BulkDeleteButton onClick={onDraftOrdersDelete}>
                    {intl.formatMessage({
                      id: "+b/qJ9",
                      defaultMessage: "Delete draft orders",
                    })}
                  </BulkDeleteButton>
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
      </DashboardCard>
    </>
  );
};

OrderDraftListPage.displayName = "OrderDraftListPage";
export default OrderDraftListPage;
