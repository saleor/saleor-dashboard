import { orders } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { OrderListDatagrid } from "./OrderListDatagrid";

const meta: Meta<typeof OrderListDatagrid> = {
  title: "Orders/OrderListDatagrid",
  component: OrderListDatagrid,

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
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
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
