import { TransactionEventTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { OrderFixture } from "../fixtures/order-fixture";
import { OrderRefunds } from "../order-refunds";

const meta = {
  title: "Order Detail Page / Content / Refunds",
  component: OrderRefunds,
  decorators: [Story => <Story />],
} satisfies Meta<typeof OrderRefunds>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    order: OrderFixture.fulfilled().withManualRefund().build(),
  },
};

export const Failure: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withManualRefund(TransactionEventTypeEnum.REFUND_FAILURE)
      .build(),
  },
};

export const Pending: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withManualRefund(TransactionEventTypeEnum.REFUND_REQUEST)
      .build(),
  },
};

export const withGrantedRefunds: Story = {
  args: {
    order: OrderFixture.fulfilled()
      .withGrantedRefund()
      .withManualRefund(TransactionEventTypeEnum.REFUND_SUCCESS)
      .build(),
  },
};

export const Empty: Story = {
  args: {
    order: OrderFixture.fulfilled().build(),
  },
};
