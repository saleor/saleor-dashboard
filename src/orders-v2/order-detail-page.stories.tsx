import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fulfilledOrderFixture } from "./fixtures";
import { MockedAppLayout } from "./mocked-app-layout";
import { OrderDetailsPage } from "./order-detail-page";

const meta = {
  title: "Order Detail Page",
  component: OrderDetailsPage,
  decorators: [
    Story => (
      <MockedAppLayout>
        <Story />
      </MockedAppLayout>
    ),
  ],
} satisfies Meta<typeof OrderDetailsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Fulfilled: Story = {
  args: {
    order: fulfilledOrderFixture,
  },
};
