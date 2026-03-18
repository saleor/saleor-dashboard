import { customerList } from "@dashboard/customers/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { CustomerListDatagrid } from "./CustomerListDatagrid";

const meta: Meta<typeof CustomerListDatagrid> = {
  title: "Customers/CustomerListDatagrid",
  component: CustomerListDatagrid,
  args: {
    customers: customerList,
    loading: false,
    disabled: false,
    hasRowHover: true,
    sort: { sort: "name" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["name", "email", "orders"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectCustomerIds: fn(),
    onRowClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CustomerListDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { customers: [] },
};
