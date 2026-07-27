import { OrderAction } from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrderDetailsStoryHarness } from "./OrderDetailsStoryHarness";

const meta: Meta<typeof OrderDetailsStoryHarness> = {
  title: "Orders / OrderDetails page",
  component: OrderDetailsStoryHarness,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof OrderDetailsStoryHarness>;

// Legacy: has payments and no transactions -> Payments API view.
export const LegacyNormal: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withLegacyPayments()
      .withActions([OrderAction.CAPTURE, OrderAction.REFUND, OrderAction.VOID])
      .build(),
  },
};

export const LegacyUnconfirmed: Story = {
  args: {
    order: OrderFixture.unconfirmed()
      .withLegacyPayments()
      .withActions([OrderAction.MARK_AS_PAID])
      .build(),
  },
};

// Transactions: has transactions -> Transactions API view.
export const TransactionNormal: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withTransaction()
      .withActions([OrderAction.MARK_AS_PAID])
      .build(),
  },
};

export const TransactionUnconfirmed: Story = {
  args: {
    order: OrderFixture.unconfirmed().withTransaction().build(),
  },
};

// Hybrid: both payments and transactions -> Transactions API view wins,
// historical legacy payment data stays visible.
export const HybridNormal: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withLegacyPayments()
      .withTransaction()
      .withActions([OrderAction.MARK_AS_PAID])
      .build(),
  },
};
