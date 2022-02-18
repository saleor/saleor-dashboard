import { CustomerListUrlSortField } from "@saleor/customers/urls";
import { storiesOf } from "@storybook/react";
import React from "react";

import CustomerListPageComponent, {
  CustomerListPageProps
} from "../../../customers/components/CustomerListPage";
import { customerList } from "../../../customers/fixtures";
import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";
import { ComponentWithMockContext } from "./ComponentWithMockContext";

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
        min: undefined
      }
    },
    numberOfOrders: {
      active: false,
      value: {
        max: undefined,
        min: undefined
      }
    }
  },
  sort: {
    ...sortPageProps.sort,
    sort: CustomerListUrlSortField.name
  }
};

const CustomerListPage = props => (
  <ComponentWithMockContext>
    <CustomerListPageComponent {...props} />
  </ComponentWithMockContext>
);

storiesOf("Views / Customers / Customer list", module)
  .addDecorator(Decorator)
  .add("default", () => <CustomerListPage {...props} />)
  .add("loading", () => (
    <CustomerListPage {...props} disabled={true} customers={undefined} />
  ))
  .add("no data", () => <CustomerListPage {...props} customers={[]} />);
