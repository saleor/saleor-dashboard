import { storiesOf } from "@storybook/react";
import React from "react";

import { CustomerListUrlSortField } from "@saleor/customers/urls";
import CustomerListPage, {
  CustomerListPageProps
} from "../../../customers/components/CustomerListPage";
import { customerList } from "../../../customers/fixtures";
import {
  listActionsProps,
  pageListProps,
  searchPageProps,
  tabPageProps,
  sortPageProps,
  filterPageProps
} from "../../../fixtures";
import Decorator from "../../Decorator";

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
    moneySpent: {
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

storiesOf("Views / Customers / Customer list", module)
  .addDecorator(Decorator)
  .add("default", () => <CustomerListPage {...props} />)
  .add("loading", () => (
    <CustomerListPage {...props} disabled={true} customers={undefined} />
  ))
  .add("no data", () => <CustomerListPage {...props} customers={[]} />);
