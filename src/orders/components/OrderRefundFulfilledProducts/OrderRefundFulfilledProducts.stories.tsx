import { FulfillmentStatus, type OrderRefundDataQuery } from "@dashboard/graphql";
import {
  OrderRefundAmountCalculationMode,
  type OrderRefundFormData,
  OrderRefundType,
} from "@dashboard/orders/components/OrderRefundPage/form";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import OrderRefundFulfilledProducts from "./OrderRefundFulfilledProducts";

type Fulfillment = NonNullable<OrderRefundDataQuery["order"]>["fulfillments"][0];
type TaxedMoney = NonNullable<NonNullable<Fulfillment["lines"]>[number]["orderLine"]>["unitPrice"];

const money = (amount: number): TaxedMoney => ({
  __typename: "TaxedMoney" as const,
  gross: { __typename: "Money" as const, amount, currency: "USD" },
});

const fulfillment: Fulfillment = {
  __typename: "Fulfillment",
  id: "fulfillment-1",
  status: FulfillmentStatus.FULFILLED,
  fulfillmentOrder: 1,
  lines: [
    {
      __typename: "FulfillmentLine",
      id: "fulfillment-line-1",
      quantity: 3,
      orderLine: {
        __typename: "OrderLine",
        id: "line-1",
        productName: "Hoodie",
        quantity: 3,
        unitPrice: money(45),
        thumbnail: null,
      },
    },
    {
      __typename: "FulfillmentLine",
      id: "fulfillment-line-2",
      quantity: 1,
      orderLine: {
        __typename: "OrderLine",
        id: "line-2",
        productName: "T-Shirt with a deliberately long name that wraps in the product column",
        quantity: 1,
        unitPrice: money(20),
        thumbnail: null,
      },
    },
  ],
};

const data = (quantities: Record<string, string>): OrderRefundFormData => ({
  amount: "0",
  type: OrderRefundType.PRODUCTS,
  refundShipmentCosts: false,
  amountCalculationMode: OrderRefundAmountCalculationMode.AUTOMATIC,
  refundedProductQuantities: [],
  refundedFulfilledProductQuantities: (fulfillment.lines ?? []).map(line => ({
    id: line.id,
    label: line.orderLine?.productName ?? "",
    data: null,
    value: quantities[line.id] ?? "0",
  })),
});

const meta: Meta<typeof OrderRefundFulfilledProducts> = {
  title: "Orders/OrderRefundFulfilledProducts",
  component: OrderRefundFulfilledProducts,
  args: {
    fulfillment,
    data: data({}),
    disabled: false,
    orderNumber: "17",
    onRefundedProductQuantityChange: fn(),
    onSetMaximalQuantities: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderRefundFulfilledProducts>;

export const Default: Story = {};

export const WithQuantities: Story = {
  args: { data: data({ "fulfillment-line-1": "2", "fulfillment-line-2": "1" }) },
};

/** Above the fulfilled quantity — the input turns red. */
export const OverRefunded: Story = {
  args: { data: data({ "fulfillment-line-1": "9" }) },
};

export const Returned: Story = {
  args: { fulfillment: { ...fulfillment, status: FulfillmentStatus.RETURNED } },
};

export const Disabled: Story = {
  args: { disabled: true },
};
