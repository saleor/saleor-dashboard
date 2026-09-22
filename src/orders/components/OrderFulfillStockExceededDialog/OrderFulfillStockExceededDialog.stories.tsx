import { type WarehouseFragment } from "@dashboard/graphql";
import { fulfillOrderLine } from "@dashboard/orders/fixtures";
import { type OrderFulfillStockFormsetData } from "@dashboard/orders/utils/data";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderFulfillStockExceededDialog } from "./OrderFulfillStockExceededDialog";

const placeholderImage = "https://via.placeholder.com/64";

const line = {
  ...fulfillOrderLine(placeholderImage),
  quantityFulfilled: 0,
  quantityToFulfill: 200,
};

const secondLine = { ...line, id: "T3JkZXJMaW5lOjI0", productName: "Sneakers (42)" };

const warehouse: WarehouseFragment = {
  __typename: "Warehouse",
  id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
  name: "stock_warehouse1",
};

const formsetData: OrderFulfillStockFormsetData = [line, secondLine].map(item => ({
  id: item.id,
  value: [{ quantity: 200, warehouse }],
}));

const meta: Meta<typeof OrderFulfillStockExceededDialog> = {
  title: "Orders/OrderFulfillStockExceededDialog",
  component: OrderFulfillStockExceededDialog,
  args: {
    open: true,
    lines: [line, secondLine],
    formsetData,
    confirmButtonState: "default",
    onClose: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderFulfillStockExceededDialog>;

export const Default: Story = {};

export const SingleLine: Story = {
  args: { lines: [line] },
};

export const Loading: Story = {
  args: { confirmButtonState: "loading" },
};

export const Empty: Story = {
  args: { lines: [] },
};
