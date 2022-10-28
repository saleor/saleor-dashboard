import { Card } from "@material-ui/core";
import {
  extensionMountPoints,
  mapToMenuItems,
  mapToMenuItemsForCustomerOverviewActions,
  useExtensions,
} from "@saleor/apps/useExtensions";
import { useUserPermissions } from "@saleor/auth/hooks/useUserPermissions";
import ButtonWithSelect from "@saleor/components/ButtonWithSelect";
import CardMenu from "@saleor/components/CardMenu/CardMenu";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import {
  customerAddUrl,
  CustomerListUrlSortField,
} from "@saleor/customers/urls";
import { ListCustomersQuery } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
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

const useStyles = makeStyles(
  theme => ({
    settings: {
      marginRight: theme.spacing(2),
    },
  }),
  { name: "CustomerListPage" },
);

export interface CustomerListPageProps
  extends PageListProps,
    ListActions,
    FilterPageProps<CustomerFilterKeys, CustomerListFilterOpts>,
    SortPage<CustomerListUrlSortField>,
    TabPageProps {
  customers: RelayToFlat<ListCustomersQuery["customers"]>;
  selectedCustomerIds: string[];
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
  selectedCustomerIds,
  ...customerListProps
}) => {
  const intl = useIntl();
  const classes = useStyles({});
  const navigate = useNavigator();

  const userPermissions = useUserPermissions();
  const structure = createFilterStructure(intl, filterOpts, userPermissions);

  const {
    CUSTOMER_OVERVIEW_CREATE,
    CUSTOMER_OVERVIEW_MORE_ACTIONS,
  } = useExtensions(extensionMountPoints.CUSTOMER_LIST);
  const extensionMenuItems = mapToMenuItemsForCustomerOverviewActions(
    CUSTOMER_OVERVIEW_MORE_ACTIONS,
    selectedCustomerIds,
  );
  const extensionCreateButtonItems = mapToMenuItems(CUSTOMER_OVERVIEW_CREATE);

  return (
    <Container>
      <PageHeader
        title={intl.formatMessage(sectionNames.customers)}
        cardMenu={
          extensionMenuItems.length > 0 && (
            <CardMenu
              className={classes.settings}
              menuItems={extensionMenuItems}
            />
          )
        }
      >
        <ButtonWithSelect
          onClick={() => navigate(customerAddUrl)}
          options={extensionCreateButtonItems}
          data-test-id="create-customer"
        >
          <FormattedMessage
            id="QLVddq"
            defaultMessage="Create customer"
            description="button"
          />
        </ButtonWithSelect>
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
