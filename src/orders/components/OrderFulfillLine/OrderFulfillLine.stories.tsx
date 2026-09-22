import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import { type WarehouseFragment } from "@dashboard/graphql";
import { type FormsetData } from "@dashboard/hooks/useFormset";
import { fulfillOrderLine } from "@dashboard/orders/fixtures";
import { type OrderFulfillLineFormData } from "@dashboard/orders/utils/data";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import OrderFulfillLine from "./OrderFulfillLine";

const placeholderImage = "https://via.placeholder.com/64";

const line = {
  ...fulfillOrderLine(placeholderImage),
  quantityFulfilled: 0,
  quantityToFulfill: 2,
};

const warehouse: WarehouseFragment = {
  __typename: "Warehouse",
  id: "V2FyZWhvdXNlOjc4OGUyMGRlLTlmYTAtNDI5My1iZDk2LWUwM2RjY2RhMzc0ZQ==",
  name: "stock_warehouse1",
};

const formsetData = (quantity: number): FormsetData<null, OrderFulfillLineFormData[]> => [
  { id: line.id, label: line.productName, data: null, value: [{ quantity, warehouse }] },
];

const meta: Meta<typeof OrderFulfillLine> = {
  title: "Orders/OrderFulfillLine",
  component: OrderFulfillLine,
  render: (args: ComponentProps<typeof OrderFulfillLine>) => (
    <ResponsiveTable>
      <TableBody>
        <OrderFulfillLine {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: {
    line,
    lineIndex: 0,
    formsetData: formsetData(0),
    formsetChange: fn(),
    onWarehouseChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderFulfillLine>;

/** Nothing entered yet — the row stays neutral. */
export const Default: Story = {};

export const PartiallyFulfilling: Story = {
  args: { formsetData: formsetData(1) },
};

/** More than the line needs — the quantity input goes into its error state. */
export const Overfulfilled: Story = {
  args: { formsetData: formsetData(5) },
};

/** Deleted variants can still be listed, but nothing is available to pick from. */
export const DeletedVariant: Story = {
  args: { line: { ...line, variant: null } },
};

/** Already fulfilled in full. */
export const NothingToFulfill: Story = {
  args: { line: fulfillOrderLine(placeholderImage) },
};
