import { type OrderRefundDataQuery } from "@dashboard/graphql";
import {
  OrderRefundAmountCalculationMode,
  type OrderRefundFormData,
  OrderRefundType,
} from "@dashboard/orders/components/OrderRefundPage/form";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import OrderRefundUnfulfilledProducts from "./OrderRefundUnfulfilledProducts";

type UnfulfilledLines = NonNullable<OrderRefundDataQuery["order"]>["lines"];

const money = (amount: number): UnfulfilledLines[number]["unitPrice"] => ({
  __typename: "TaxedMoney" as const,
  gross: { __typename: "Money" as const, amount, currency: "USD" },
});

const unfulfilledLines: UnfulfilledLines = [
  {
    __typename: "OrderLine",
    id: "line-1",
    productName: "Hoodie",
    quantity: 3,
    quantityToFulfill: 3,
    unitPrice: money(45),
    thumbnail: null,
  },
  {
    __typename: "OrderLine",
    id: "line-2",
    productName: "T-Shirt with a deliberately long name that wraps in the product column",
    quantity: 1,
    quantityToFulfill: 1,
    unitPrice: money(20),
    thumbnail: null,
  },
];

const data = (quantities: Record<string, string>): OrderRefundFormData => ({
  amount: "0",
  type: OrderRefundType.PRODUCTS,
  refundShipmentCosts: false,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundedFulfilledProductQuantities: [],
  refundedProductQuantities: unfulfilledLines.map((line: UnfulfilledLines[number]) => ({
    id: line.id,
    label: line.productName,
    data: null,
    value: quantities[line.id] ?? "0",
  })),
});

const meta: Meta<typeof OrderRefundUnfulfilledProducts> = {
  title: "Orders/OrderRefundUnfulfilledProducts",
  component: OrderRefundUnfulfilledProducts,
  args: {
    unfulfilledLines,
    data: data({}),
    disabled: false,
    onRefundedProductQuantityChange: fn(),
    onSetMaximalQuantities: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderRefundUnfulfilledProducts>;

export const Default: Story = {};

export const WithQuantities: Story = {
  args: { data: data({ "line-1": "2", "line-2": "1" }) },
};

/** Above the ordered quantity — the input turns red. */
export const OverRefunded: Story = {
  args: { data: data({ "line-1": "9" }) },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { unfulfilledLines: [] },
};
