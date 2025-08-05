import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { OrderDetailsPage } from "../order-detail-page";
import { fulfilledOrderFixture } from "./fixtures";
import { StorybookAppLayout } from "./storybook-app-layout";

const meta = {
  title: "Order Detail Page",
  component: OrderDetailsPage,
  decorators: [
    Story => (
      <StorybookAppLayout>
        <Story />
      </StorybookAppLayout>
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
