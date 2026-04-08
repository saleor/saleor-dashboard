import { order } from "@dashboard/orders/fixtures";
import { OrderLineDiscountContext } from "@dashboard/products/components/OrderDiscountProviders/OrderLineDiscountProvider";
import { type GetOrderLineDiscountContextConsumerProps } from "@dashboard/products/components/OrderDiscountProviders/types";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { OrderDraftDetailsDatagrid } from "./OrderDraftDetailsDatagrid";

const placeholderImage = "https://via.placeholder.com/64";
const orderFixture = order(placeholderImage);

const mockGetOrderLineDiscountValues: GetOrderLineDiscountContextConsumerProps = (
  orderLineId: string,
) => {
  const line = orderFixture.lines.find(l => l.id === orderLineId);
  const unitPrice = line?.unitPrice?.gross ?? { amount: 0, currency: "USD", __typename: "Money" };
  const undiscountedPrice = line?.undiscountedUnitPrice?.gross ?? unitPrice;

  return {
    addOrderLineDiscount: fn(),
    removeOrderLineDiscount: fn(),
    orderLineDiscountUpdateStatus: "default",
    orderLineDiscountRemoveStatus: "default",
    isDialogOpen: false,
    openDialog: fn(),
    closeDialog: fn(),
    totalDiscountedPrice: line?.totalPrice?.gross ?? unitPrice,
    unitDiscountedPrice: unitPrice,
    unitUndiscountedPrice: undiscountedPrice,
  };
};

const meta: Meta<typeof OrderDraftDetailsDatagrid> = {
  title: "Orders/OrderDraftDetailsDatagrid",
  component: OrderDraftDetailsDatagrid,
  decorators: [
    (Story: StoryFn) => (
      <OrderLineDiscountContext.Provider value={mockGetOrderLineDiscountValues}>
        <Story />
      </OrderLineDiscountContext.Provider>
    ),
  ],

  args: {
    lines: orderFixture.lines,
    loading: false,
    errors: [],
    onOrderLineChange: fn(),
    onOrderLineRemove: fn(),
    onOrderLineShowMetadata: fn(),
  },
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
  },
};

export default meta;
type Story = StoryObj<typeof OrderDraftDetailsDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Empty: Story = {
  args: { lines: [] },
};
