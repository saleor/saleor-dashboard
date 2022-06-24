import { CustomerListUrlSortField } from "@saleor/customers/urls";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import CustomerListPageComponent, {
  CustomerListPageProps,
} from "../../../customers/components/CustomerListPage";
import { customerList } from "../../../customers/fixtures";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "../../../fixtures";
import Decorator from "../../Decorator";
import { MockedUserProvider } from "./MockedUserProvider";

const props: CustomerListPageProps = {
  ...filterPageProps,
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  customers: customerList,
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

storiesOf("Views / Customers / Customer list", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <CustomerListPage {...props} />)
  .add("loading", () => (
    <CustomerListPage {...props} disabled={true} customers={undefined} />
  ))
  .add("no data", () => <CustomerListPage {...props} customers={[]} />);
