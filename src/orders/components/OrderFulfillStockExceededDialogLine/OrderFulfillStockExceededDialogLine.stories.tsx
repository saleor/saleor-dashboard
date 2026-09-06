import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import { type WarehouseFragment } from "@dashboard/graphql";
import { fulfillOrderLine } from "@dashboard/orders/fixtures";
import { type OrderFulfillStockFormsetData } from "@dashboard/orders/utils/data";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import { OrderFulfillStockExceededDialogLine } from "./OrderFulfillStockExceededDialogLine";

const placeholderImage = "https://via.placeholder.com/64";

const line = {
  ...fulfillOrderLine(placeholderImage),
  quantityFulfilled: 0,
  quantityToFulfill: 200,
};

const warehouse: WarehouseFragment = {
  __typename: "Warehouse",
  id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
  name: "stock_warehouse1",
};

const formsetData: OrderFulfillStockFormsetData = [
  { id: line.id, value: [{ quantity: 200, warehouse }] },
];

const meta: Meta<typeof OrderFulfillStockExceededDialogLine> = {
  title: "Orders/OrderFulfillStockExceededDialogLine",
  component: OrderFulfillStockExceededDialogLine,
  render: (args: ComponentProps<typeof OrderFulfillStockExceededDialogLine>) => (
    <ResponsiveTable>
      <TableBody>
        <OrderFulfillStockExceededDialogLine {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: { line, warehouse, formsetData },
};

export default meta;
type Story = StoryObj<typeof OrderFulfillStockExceededDialogLine>;

/** Requested quantity exceeds the warehouse stock — the delta column goes negative. */
export const Default: Story = {};

/** No stock record for the chosen warehouse. */
export const WithoutStock: Story = {
  args: { warehouse: { id: "unknown", name: "Unknown warehouse" } },
};
