import {
  DiscountValueTypeEnum,
  type OrderEventFragment,
  OrderEventsEnum,
} from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { MemoryRouter } from "react-router-dom";
import { fn } from "storybook/test";

import { OrderHistory } from "./OrderHistory";

const baseDate = "2026-03-20T10:00:00.000Z";

const createEvent = (overrides: Partial<OrderEventFragment>): OrderEventFragment => ({
  __typename: "OrderEvent",
  id: "event-1",
  amount: null,
  shippingCostsIncluded: null,
  date: baseDate,
  email: null,
  emailType: null,
  invoiceNumber: null,
  message: null,
  quantity: null,
  transactionReference: null,
  type: OrderEventsEnum.OTHER,
  discount: null,
  relatedOrder: null,
  related: null,
  user: null,
  app: null,
  lines: null,
  ...overrides,
});

const lineDiscount = {
  __typename: "OrderEventDiscountObject" as const,
  valueType: DiscountValueTypeEnum.FIXED,
  value: 5,
  reason: "Seasonal adjustment",
  oldValueType: DiscountValueTypeEnum.FIXED,
  oldValue: 2,
  amount: {
    __typename: "Money" as const,
    amount: 5,
    currency: "USD",
  },
  oldAmount: {
    __typename: "Money" as const,
    amount: 2,
    currency: "USD",
  },
};

const meta: Meta<typeof OrderHistory> = {
  title: "Orders/OrderHistory",
  component: OrderHistory,
  decorators: [
    (Story: ComponentType) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    history: { table: { disable: true } },
    onNoteAdd: { table: { disable: true } },
    onNoteUpdate: { table: { disable: true } },
  },
  args: {
    orderCurrency: "USD",
    onNoteAdd: fn(() => Promise.resolve(undefined)),
    onNoteUpdate: fn(() => Promise.resolve({})),
    onNoteUpdateLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof OrderHistory>;

export const OrderLineDiscountRemoved: Story = {
  args: {
    history: [
      createEvent({
        id: "event-order-line-discount-removed",
        type: OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED,
        lines: [
          {
            __typename: "OrderEventOrderLineObject",
            discount: null,
            itemName: "Running Shoes / 42",
            orderLine: {
              __typename: "OrderLine",
              id: "line-1",
              productName: "Running Shoes",
              variantName: "Size 42",
            },
            quantity: 2,
          },
        ],
      }),
    ],
  },
};

export const OrderLineDiscountUpdated: Story = {
  args: {
    history: [
      createEvent({
        id: "event-order-line-discount-updated",
        type: OrderEventsEnum.ORDER_LINE_DISCOUNT_UPDATED,
        lines: [
          {
            __typename: "OrderEventOrderLineObject",
            discount: lineDiscount,
            itemName: "T-Shirt / M",
            orderLine: {
              __typename: "OrderLine",
              id: "line-2",
              productName: "T-Shirt",
              variantName: "M",
            },
            quantity: 1,
          },
        ],
      }),
    ],
  },
};

export const OrderDiscountAutomaticallyUpdated: Story = {
  args: {
    history: [
      createEvent({
        id: "event-order-discount-automatically-updated",
        type: OrderEventsEnum.ORDER_DISCOUNT_AUTOMATICALLY_UPDATED,
        discount: {
          ...lineDiscount,
          reason: "Promotion rule recalculation",
        },
      }),
    ],
  },
};

export const DraftCreatedFromReplace: Story = {
  args: {
    history: [
      createEvent({
        id: "event-draft-created-from-replace",
        type: OrderEventsEnum.DRAFT_CREATED_FROM_REPLACE,
        relatedOrder: {
          __typename: "Order",
          id: "order-123",
          number: "123",
        },
      }),
    ],
  },
};

export const OrderLineDiscountRemovedWithoutProductData: Story = {
  args: {
    history: [
      createEvent({
        id: "event-order-line-discount-removed-fallback",
        type: OrderEventsEnum.ORDER_LINE_DISCOUNT_REMOVED,
        lines: [
          {
            __typename: "OrderEventOrderLineObject",
            discount: null,
            itemName: null,
            orderLine: null,
            quantity: null,
          },
        ],
      }),
    ],
  },
};
