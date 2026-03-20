import { orders } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderDraftListDatagrid } from "./OrderDraftListDatagrid";

const draftOrders = orders as any;

const meta: Meta<typeof OrderDraftListDatagrid> = {
  title: "Orders/OrderDraftListDatagrid",
  component: OrderDraftListDatagrid,

  args: {
    orders: draftOrders,
    disabled: false,
    hasRowHover: true,
    sort: { sort: "number" as any, asc: true },
    onSort: fn(),
    settings: { columns: ["number", "date", "customer", "total", "channel"], rowsPerPage: 20 },
    onUpdateListSettings: fn(),
    onSelectOrderDraftIds: fn(),
    onRowClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderDraftListDatagrid>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { orders: [] },
};
