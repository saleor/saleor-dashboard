import { FulfillmentStatus } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ActionButtons } from "./ActionButtons";

const meta: Meta<typeof ActionButtons> = {
  title: "Orders/OrderFulfillmentCard/ActionButtons",
  component: ActionButtons,
  args: {
    orderId: "order-1",
    trackingNumber: undefined,
    orderIsPaid: true,
    fulfillmentAllowUnpaid: false,
    hasTransactions: false,
    onTrackingCodeAdd: fn(),
    onApprove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ActionButtons>;

export const ReturnedRefund: Story = {
  args: { status: FulfillmentStatus.RETURNED, hasTransactions: false },
};

export const WaitingForApprovalPaid: Story = {
  args: { status: FulfillmentStatus.WAITING_FOR_APPROVAL, orderIsPaid: true },
};

export const WaitingForApprovalUnpaid: Story = {
  args: {
    status: FulfillmentStatus.WAITING_FOR_APPROVAL,
    orderIsPaid: false,
    fulfillmentAllowUnpaid: false,
  },
};

export const FulfilledNoTracking: Story = {
  args: { status: FulfillmentStatus.FULFILLED },
};

export const FulfilledWithTracking: Story = {
  args: { status: FulfillmentStatus.FULFILLED, trackingNumber: "TRK-12345" },
};
