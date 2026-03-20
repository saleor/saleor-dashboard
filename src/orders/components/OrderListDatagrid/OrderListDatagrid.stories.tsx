import { orders } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderListDatagrid } from "./OrderListDatagrid";

const meta: Meta<typeof OrderListDatagrid> = {
  title: "Orders/OrderListDatagrid",
  component: OrderListDatagrid,
  parameters: {
    chromatic: { diffThreshold: 0.3, delay: 500 },
  },
  args: {
    orders,
    disabled: false,
    hasRowHover: true,
    sort: { sort: "number" as any, asc: true },
    onSort: fn(),
    settings: {
      columns: ["number", "date", "customer", "payment", "status", "total", "channel"],
      rowsPerPage: 20,
    },
    onUpdateListSettings: fn(),
    onRowClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { orders: [] },
};
