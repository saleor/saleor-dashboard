import { Card } from "@material-ui/core";
import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import { Button } from "@saleor/components/Button";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import {
  customerAddUrl,
  CustomerListUrlSortField,
} from "@saleor/customers/urls";
import { ListCustomersQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import {
  FilterPageProps,
  ListActions,
  PageListProps,
  RelayToFlat,
  SortPage,
  TabPageProps,
} from "@saleor/types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerList from "../CustomerList/CustomerList";
import {
  createFilterStructure,
  CustomerFilterKeys,
  CustomerListFilterOpts,
} from "./filters";

export interface CustomerListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<CustomerFilterKeys, CustomerListFilterOpts>,
    SortPage<CustomerListUrlSortField>,
    TabPageProps {
  customers: RelayToFlat<ListCustomersQuery["customers"]>;
}

const CustomerListPage: React.FC<CustomerListPageProps> = ({
  currentTab,
  filterOpts,
  initialSearch,
  onAll,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  ...customerListProps
}) => {
  const intl = useIntl();

  const userPermissions = useUserPermissions();
  const structure = createFilterStructure(intl, filterOpts, userPermissions);

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.customers)}>
        <Button
          variant="primary"
          href={customerAddUrl}
          data-test-id="create-customer"
        >
          <FormattedMessage
            id="QLVddq"
            defaultMessage="Create customer"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            id: "xQK2EC",
            defaultMessage: "All Customers",
            description: "tab name",
          })}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "2mRLis",
            defaultMessage: "Search Customer",
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <CustomerList {...customerListProps} />
      </Card>
    </Container>
  );
};
CustomerListPage.displayName = "CustomerListPage";
export default CustomerListPage;
