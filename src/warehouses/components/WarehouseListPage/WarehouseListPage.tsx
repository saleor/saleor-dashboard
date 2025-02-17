import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import { configurationMenuUrl } from "@dashboard/configuration";
import { RefreshLimitsQuery, WarehouseWithShippingFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { messages } from "@dashboard/shipping/components/ShippingZonesListPage/messages";
import { PageListProps, SearchPageProps, SortPage, TabPageProps } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { warehouseAddUrl, WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseList from "../WarehouseList";

export interface WarehouseListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<WarehouseListUrlSortField>,
    Omit<TabPageProps, "onTabDelete"> {
  limits: RefreshLimitsQuery["shop"]["limits"] | undefined;
  warehouses: WarehouseWithShippingFragment[] | undefined;
  onRemove: (id: string | undefined) => void;
  onTabUpdate: (tabName: string) => void;
  onTabDelete: (id: number) => void;
  hasPresetsChanged: () => boolean;
}

export const WarehouseListPage: React.FC<WarehouseListPageProps> = ({
  warehouses,
  currentTab,
  disabled,
  limits,
  initialSearch,
  settings,
  tabs,
  onAll,
  onRemove,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  onTabUpdate,
  hasPresetsChanged,
  onUpdateListSettings,
  ...listProps
}) => {
  const intl = useIntl();
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);
  const limitReached = isLimitReached(limits, "warehouses");

  return (
    <ListPageLayout>
      <TopNav
        isAlignToRight={false}
        withoutBorder
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.warehouses)}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onTabChange}
              onRemove={onTabDelete}
              onUpdate={onTabUpdate}
              savedPresets={tabs}
              activePreset={currentTab}
              onSelectAll={onAll}
              onSave={onTabSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "eaoi2W",
                defaultMessage: "All warehouses",
                description: "tab name",
              })}
            />
          </Box>
          <Box>
            <Button
              data-test-id="create-warehouse"
              disabled={limitReached}
              variant="primary"
              href={warehouseAddUrl}
            >
              <FormattedMessage
                id="wmdHhD"
                defaultMessage="Create Warehouse"
                description="button"
              />
            </Button>

            {hasLimits(limits, "warehouses") && (
              <LimitsInfo
                text={intl.formatMessage(
                  {
                    id: "YkOzse",
                    defaultMessage: "{count}/{max} warehouses used",
                    description: "used warehouses counter",
                  },
                  {
                    count: limits?.currentUsage.warehouses,
                    max: limits?.allowedUsage.warehouses,
                  },
                )}
              />
            )}
          </Box>
        </Box>
      </TopNav>

      {limitReached && (
        <LimitReachedAlert
          title={intl.formatMessage({
            id: "5HwLx9",
            defaultMessage: "Warehouse limit reached",
            description: "alert",
          })}
        >
          <FormattedMessage
            id="kFQvXv"
            defaultMessage="You have reached your warehouse limit, you will be no longer able to add warehouses to your store. If you would like to up your limit, contact your administration staff about raising your limits."
          />
        </LimitReachedAlert>
      )}
      <DashboardCard gap={0}>
        <Box paddingX={6} marginY={2}>
          <Box __width="320px">
            {/*TODO:To be replaced by ListFilters BCK-1476*/}
            <SearchInput
              initialSearch={initialSearch}
              placeholder={intl.formatMessage(messages.searchShippingZones)}
              onSearchChange={onSearchChange}
            />
          </Box>
        </Box>

        <WarehouseList
          warehouses={warehouses}
          disabled={disabled}
          settings={settings}
          onRemove={onRemove}
          onUpdateListSettings={onUpdateListSettings}
          {...listProps}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};
WarehouseListPage.displayName = "WarehouseListPage";
export default WarehouseListPage;
