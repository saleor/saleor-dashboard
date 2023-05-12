import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { MockedUserProvider } from "../../../../.storybook/helpers";
import { customerList } from "../../fixtures";
import { CustomerListUrlSortField } from "../../urls";
import CustomerListPageComponent, {
  CustomerListPageProps,
} from "./CustomerListPage";

const props: CustomerListPageProps = {
  ...filterPageProps,
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  customers: customerList,
  selectedCustomerIds: ["123"],
  filterOpts: {
    joined: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
    numberOfOrders: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
  },
  sort: {
    ...sortPageProps.sort,
    sort: CustomerListUrlSortField.name,
  },
};

const CustomerListPage = props => (
  <MockedUserProvider>
    <CustomerListPageComponent {...props} />
  </MockedUserProvider>
);

export default {
  title: "Customers / Customer list",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <CustomerListPage {...props} />;

export const Loading = () => (
  <CustomerListPage {...props} disabled={true} customers={undefined} />
);

export const NoData = () => <CustomerListPage {...props} customers={[]} />;
