import { Card } from "@material-ui/core";
import { Backlink } from "@saleor/components/Backlink";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import LimitReachedAlert from "@saleor/components/LimitReachedAlert";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { configurationMenuUrl } from "@saleor/configuration";
import {
  RefreshLimitsQuery,
  WarehouseWithShippingFragment,
} from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import {
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps,
} from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import {
  warehouseAddUrl,
  WarehouseListUrlSortField,
} from "@saleor/warehouses/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseList from "../WarehouseList";

export interface WarehouseListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<WarehouseListUrlSortField>,
    TabPageProps {
  limits: RefreshLimitsQuery["shop"]["limits"];
  warehouses: WarehouseWithShippingFragment[];
  onRemove: (id: string) => void;
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
    <Container>
      <Backlink href={configurationMenuUrl}>
        <FormattedMessage {...sectionNames.configuration} />
      </Backlink>
      <PageHeader
        title={intl.formatMessage(sectionNames.warehouses)}
        limitText={
          hasLimits(limits, "warehouses") &&
          intl.formatMessage(
            {
              id: "YkOzse",
              defaultMessage: "{count}/{max} warehouses used",
              description: "used warehouses counter",
            },
            {
              count: limits.currentUsage.warehouses,
              max: limits.allowedUsage.warehouses,
            },
          )
        }
      >
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
      </PageHeader>
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
      <Card>
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
      </Card>
    </Container>
  );
};
WarehouseListPage.displayName = "WarehouseListPage";
export default WarehouseListPage;
