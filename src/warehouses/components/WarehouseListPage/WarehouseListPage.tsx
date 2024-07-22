import { LimitsInfo } from "@dashboard/components/AppLayout/LimitsInfo";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import LimitReachedAlert from "@dashboard/components/LimitReachedAlert";
import SearchBar from "@dashboard/components/SearchBar";
import { configurationMenuUrl } from "@dashboard/configuration";
import { RefreshLimitsQuery, WarehouseWithShippingFragment } from "@dashboard/graphql";
import { sectionNames } from "@dashboard/intl";
import { PageListProps, SearchPageProps, SortPage, TabPageProps } from "@dashboard/types";
import { hasLimits, isLimitReached } from "@dashboard/utils/limits";
import { warehouseAddUrl, WarehouseListUrlSortField } from "@dashboard/warehouses/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseList from "../WarehouseList";

export interface WarehouseListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<WarehouseListUrlSortField>,
    TabPageProps {
  limits: RefreshLimitsQuery["shop"]["limits"] | undefined;
  warehouses: WarehouseWithShippingFragment[] | undefined;
  onRemove: (id: string | undefined) => void;
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
  onUpdateListSettings,
  ...listProps
}) => {
  const intl = useIntl();
  const limitReached = isLimitReached(limits, "warehouses");

  return (
    <ListPageLayout>
      <Backlink href={configurationMenuUrl}>
        <FormattedMessage {...sectionNames.configuration} />
      </Backlink>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.warehouses)}>
        <Button
          data-test-id="create-warehouse"
          disabled={limitReached}
          variant="primary"
          href={warehouseAddUrl}
        >
          <FormattedMessage id="wmdHhD" defaultMessage="Create Warehouse" description="button" />
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
      <DashboardCard>
        <SearchBar
          allTabLabel={intl.formatMessage({
            id: "2yU+q9",
            defaultMessage: "All Warehouses",
            description: "tab name",
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "caMMWN",
            defaultMessage: "Search Warehouse",
          })}
          tabs={tabs}
          onAll={onAll}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
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
