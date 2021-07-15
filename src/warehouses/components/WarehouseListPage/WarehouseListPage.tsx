import { Button, Card } from "@material-ui/core";
import Alert from "@saleor/components/Alert/Alert";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { RefreshLimits_shop_limits } from "@saleor/components/Shop/types/RefreshLimits";
import { WarehouseWithShippingFragment } from "@saleor/fragments/types/WarehouseWithShippingFragment";
import { sectionNames } from "@saleor/intl";
import {
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import { hasLimits, isLimitReached } from "@saleor/utils/limits";
import { WarehouseListUrlSortField } from "@saleor/warehouses/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseList from "../WarehouseList";

export interface WarehouseListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<WarehouseListUrlSortField>,
    TabPageProps {
  limits: RefreshLimits_shop_limits;
  warehouses: WarehouseWithShippingFragment[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

export const WarehouseListPage: React.FC<WarehouseListPageProps> = ({
  warehouses,
  currentTab,
  disabled,
  limits,
  initialSearch,
  pageInfo,
  settings,
  tabs,
  onAdd,
  onAll,
  onBack,
  onNextPage,
  onPreviousPage,
  onRemove,
  onRowClick,
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
      <AppHeader onBack={onBack}>
        <FormattedMessage {...sectionNames.configuration} />
      </AppHeader>
      <PageHeader
        title={intl.formatMessage(sectionNames.warehouses)}
        limit={
          hasLimits(limits, "warehouses") && {
            data: limits,
            key: "warehouses",
            text: "warehouses used"
          }
        }
      >
        <Button
          data-test-id="createWarehouse"
          color="primary"
          disabled={limitReached}
          variant="contained"
          onClick={onAdd}
        >
          <FormattedMessage
            defaultMessage="Create Warehouse"
            description="button"
          />
        </Button>
      </PageHeader>
      <Alert
        show={limitReached}
        title={intl.formatMessage({
          defaultMessage: "Warehouse limit reached",
          description: "alert"
        })}
      >
        <FormattedMessage defaultMessage="You have reached your warehouse limit, you will be no longer able to add warehouses to your store. If you would like to up your limit, contact your administration staff about raising your limits." />
      </Alert>
      <Card>
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Warehouses",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Warehouse"
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
          pageInfo={pageInfo}
          settings={settings}
          onAdd={onAdd}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onRemove={onRemove}
          onRowClick={onRowClick}
          onUpdateListSettings={onUpdateListSettings}
          {...listProps}
        />
      </Card>
    </Container>
  );
};
WarehouseListPage.displayName = "WarehouseListPage";
export default WarehouseListPage;
