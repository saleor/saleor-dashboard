import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import FilterBar from "@saleor/components/FilterBar";
import { sectionNames } from "@saleor/intl";
import {
  PageListProps,
  TabPageProps,
  SortPage,
  FilterPageProps
} from "@saleor/types";
import { ServiceListUrlSortField } from "@saleor/services/urls";
import { ServiceList_serviceAccounts_edges_node } from "../../types/ServiceList";
import ServiceList from "../ServiceList";
import {
  ServiceFilterKeys,
  ServiceListFilterOpts,
  createFilterStructure
} from "./filters";

export interface ServiceListPageProps
  extends PageListProps,
    FilterPageProps<ServiceFilterKeys, ServiceListFilterOpts>,
    SortPage<ServiceListUrlSortField>,
    TabPageProps {
  services: ServiceList_serviceAccounts_edges_node[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

const ServiceListPage: React.FC<ServiceListPageProps> = ({
  currencySymbol,
  currentTab,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onBack,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...listProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure(intl, filterOpts);

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.serviceAccounts)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage
            defaultMessage="Create account"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Service Accounts",
            description: "tab name"
          })}
          currencySymbol={currencySymbol}
          filterStructure={structure}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Service Accounts"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <ServiceList {...listProps} />
      </Card>
    </Container>
  );
};
ServiceListPage.displayName = "ServiceListPage";
export default ServiceListPage;
