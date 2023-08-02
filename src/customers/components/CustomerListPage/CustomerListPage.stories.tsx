// @ts-strict-ignore
import {
  filterPageProps,
  filterPresetsProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { Meta, StoryObj } from "@storybook/react";
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
  ...filterPresetsProps,
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
  loading: false,
  hasPresetsChanged: () => false,
  onSelectCustomerIds: () => undefined,
  onCustomersDelete: () => undefined,
};

const CustomerListPage = (props: CustomerListPageProps) => (
  <MockedUserProvider>
    <CustomerListPageComponent {...props} />
  </MockedUserProvider>
);

const meta: Meta<typeof CustomerListPage> = {
  title: "Customers / Customer list",
  decorators: [PaginatorContextDecorator],
  component: CustomerListPage,
};
export default meta;
type Story = StoryObj<typeof CustomerListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    customers: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    customers: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
