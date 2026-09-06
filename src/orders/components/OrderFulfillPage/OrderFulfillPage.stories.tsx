import { type OrderFulfillDataQuery, WarehouseClickAndCollectOptionEnum } from "@dashboard/graphql";
import { fulfillOrderLine, shopOrderSettings } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import OrderFulfillPage from "./OrderFulfillPage";

const placeholderImage = "https://via.placeholder.com/64";

type OrderLine = NonNullable<OrderFulfillDataQuery["order"]>["lines"][number];

const line = (id: string, productName: string, quantityToFulfill: number): OrderLine => ({
  ...fulfillOrderLine(placeholderImage),
  id,
  productName,
  quantityFulfilled: 0,
  quantityToFulfill,
});

const order: OrderFulfillDataQuery["order"] = {
  __typename: "Order",
  id: "T3JkZXI6MQ==",
  isPaid: true,
  number: "17",
  deliveryMethod: { __typename: "ShippingMethod", id: "shipping-method-1" },
  lines: [line("line-1", "Hoodie", 2), line("line-2", "Sneakers", 1)],
};

const meta: Meta<typeof OrderFulfillPage> = {
  title: "Orders/OrderFulfillPage",
  component: OrderFulfillPage,
  args: {
    params: {},
    loading: false,
    errors: [],
    order,
    saveButtonBar: "default",
    shopSettings: shopOrderSettings,
    onSubmit: () => Promise.resolve([]),
    openModal: fn(),
    closeModal: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderFulfillPage>;

export const Default: Story = {};

export const Loading: Story = {
  args: { order: undefined, loading: true },
};

/** Unpaid orders warn before fulfilment. */
export const Unpaid: Story = {
  args: { order: { ...order, isPaid: false } },
};

/** Click-and-collect orders fulfil from a single warehouse. */
export const ClickAndCollect: Story = {
  args: {
    order: {
      ...order,
      deliveryMethod: {
        __typename: "Warehouse",
        id: "warehouse-1",
        clickAndCollectOption: WarehouseClickAndCollectOptionEnum.LOCAL,
      },
    },
  },
};

export const NothingToFulfill: Story = {
  args: { order: { ...order, lines: [line("line-1", "Hoodie", 0)] } },
};

export const Saving: Story = {
  args: { saveButtonBar: "loading" },
};
