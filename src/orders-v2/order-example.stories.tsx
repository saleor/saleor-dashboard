import type { Meta, StoryObj } from "@storybook/react-vite";

import { fulfilledOrderFixture } from "./fixtures";
import { OrderDetailsPage } from "./order-detail-page";

const meta = {
  title: "Order Detail Page",
  component: OrderDetailsPage,
} satisfies Meta<typeof OrderDetailsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fulfilled: Story = {
  args: {
    order: fulfilledOrderFixture,
  },
};
