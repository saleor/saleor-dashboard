import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { WarehouseWithShippingFragment } from "@saleor/fragments/types/WarehouseWithShippingFragment";
import { sectionNames } from "@saleor/intl";
import {
  PageListProps,
  SearchPageProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import { WarehouseListUrlSortField } from "@saleor/warehouses/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import WarehouseList from "../WarehouseList";

export interface WarehouseListPageProps
  extends PageListProps,
    SearchPageProps,
    SortPage<WarehouseListUrlSortField>,
    TabPageProps {
  warehouses: WarehouseWithShippingFragment[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

export const WarehouseListPage: React.FC<WarehouseListPageProps> = ({
  warehouses,
  currentTab,
  disabled,
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

  return (
    <Container>
      <AppHeader onBack={onBack}>
        <FormattedMessage {...sectionNames.configuration} />
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.warehouses)}>
        <Button color="primary" variant="contained" onClick={onAdd}>
          <FormattedMessage
            defaultMessage="Create Warehouse"
            description="button"
          />
        </Button>
      </PageHeader>
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
