import { fulfillOrderLine } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderChangeWarehouseDialog } from "./OrderChangeWarehouseDialog";

const placeholderImage = "https://via.placeholder.com/64";
const line = fulfillOrderLine(placeholderImage);

const meta: Meta<typeof OrderChangeWarehouseDialog> = {
  title: "Orders/OrderChangeWarehouseDialog",
  component: OrderChangeWarehouseDialog,
  args: {
    open: true,
    line,
    currentWarehouseId: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderChangeWarehouseDialog>;

/** Warehouses come from a live search query, so this renders its loading list offline. */
export const Default: Story = {};

/** Nothing picked yet — confirm stays disabled. */
export const WithoutCurrentWarehouse: Story = {
  args: { currentWarehouseId: "" },
};

export const Closed: Story = {
  args: { open: false },
};
