import { type OrderLineGrantRefundFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactNode } from "react";
import { fn } from "storybook/test";

import { GrantRefundContext } from "../context";
import { type OrderGrantRefundFormData } from "../form";
import { type GrantRefundState, type ReducerOrderLine } from "../reducer";
import { ProductsCard } from "./ProductCard";

const line = (
  id: string,
  productName: string,
  variantName: string,
  quantity: number,
): OrderLineGrantRefundFragment => ({
  __typename: "OrderLine",
  id,
  productName,
  variantName,
  quantity,
  quantityToFulfill: quantity,
  thumbnail: null,
  unitPrice: {
    __typename: "TaxedMoney",
    gross: { __typename: "Money", amount: 24.99, currency: "USD" },
  },
});

const lines: OrderLineGrantRefundFragment[] = [
  line("1", "Hoodie", "M", 2),
  line("2", "T-Shirt", "L", 1),
  line("3", "Sneakers", "42", 3),
];

const reducerLine = (id: string, selectedQuantity: number): ReducerOrderLine => ({
  orderLineId: id,
  selectedQuantity,
  availableQuantity: 3,
  unitPrice: 24.99,
  isDirty: false,
});

const state: GrantRefundState = {
  lines: new Map(lines.map((item, index) => [item.id, reducerLine(item.id, index)])),
  refundShipping: false,
};

const formData: OrderGrantRefundFormData = {
  amount: 0,
  reason: "",
  reasonReference: "",
  transactionId: "",
  lines: [],
  grantRefundForShipping: false,
};

const GrantRefundDecorator = ({
  children,
  reasonReferenceTypeId = "",
}: {
  children: ReactNode;
  reasonReferenceTypeId?: string;
}): React.ReactNode => (
  <GrantRefundContext.Provider
    value={{
      state,
      dispatch: fn(),
      form: { set: fn(), change: fn(), data: formData },
      totalSelectedPrice: 74.97,
      reasonReferenceTypeId,
    }}
  >
    {children}
  </GrantRefundContext.Provider>
);

const meta: Meta<typeof ProductsCard> = {
  title: "Orders/OrderGrantRefundPage/ProductsCard",
  component: ProductsCard,
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <GrantRefundDecorator>
        <Story />
      </GrantRefundDecorator>
    ),
  ],
  args: {
    title: "Unfulfilled products",
    lines,
  },
};

export default meta;
type Story = StoryObj<typeof ProductsCard>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: { subtitle: "Products that were never shipped" },
};

/** Refund reasons are only editable once a Model Type is configured. */
export const WithReasonReferences: Story = {
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <GrantRefundDecorator reasonReferenceTypeId="UGFnZVR5cGU6MQ==">
        <Story />
      </GrantRefundDecorator>
    ),
  ],
};

/** Renders nothing rather than an empty card. */
export const Empty: Story = {
  args: { lines: [] },
};
