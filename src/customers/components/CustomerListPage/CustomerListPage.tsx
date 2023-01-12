import {
  extensionMountPoints,
  mapToMenuItems,
  mapToMenuItemsForCustomerOverviewActions,
  useExtensions,
} from "@dashboard/apps/useExtensions";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import ButtonWithSelect from "@dashboard/components/ButtonWithSelect";
import CardMenu from "@dashboard/components/CardMenu/CardMenu";
import Container from "@dashboard/components/Container";
import FilterBar from "@dashboard/components/FilterBar";
import PageHeader from "@dashboard/components/PageHeader";
import {
  customerAddUrl,
  CustomerListUrlSortField,
} from "@dashboard/customers/urls";
import { ListCustomersQuery } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import {
  FilterPageProps,
  ListActions,
  PageListProps,
  RelayToFlat,
  SortPage,
  TabPageProps,
} from "@dashboard/types";
import { Card } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
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
