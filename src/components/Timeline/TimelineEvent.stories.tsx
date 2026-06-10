import { OrderEventsEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimelineEvent } from "./TimelineEvent";

const meta: Meta<typeof TimelineEvent> = {
  title: "Components/Timeline/TimelineEvent",
  component: TimelineEvent,
  args: {
    date: "2026-05-20T10:00:00Z",
    isLastInGroup: true,
  },
};

export default meta;
type Story = StoryObj<typeof TimelineEvent>;

export const PaymentRefunded: Story = {
  args: {
    eventType: OrderEventsEnum.PAYMENT_REFUNDED,
    title: "Payment was refunded",
  },
};

export const FulfillmentRefunded: Story = {
  args: {
    eventType: OrderEventsEnum.FULFILLMENT_REFUNDED,
    title: "Fulfillment was refunded",
  },
};

export const FulfillmentReturned: Story = {
  args: {
    eventType: OrderEventsEnum.FULFILLMENT_RETURNED,
    title: "Fulfillment was returned",
  },
};

export const TransactionRefundRequested: Story = {
  args: {
    eventType: OrderEventsEnum.TRANSACTION_REFUND_REQUESTED,
    title: "Refund was requested",
  },
};

export const Group: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" __maxWidth="640px">
      <TimelineEvent
        date="2026-05-20T10:00:00Z"
        eventType={OrderEventsEnum.PAYMENT_REFUNDED}
        title="Payment was refunded"
      />
      <TimelineEvent
        date="2026-05-20T10:05:00Z"
        eventType={OrderEventsEnum.FULFILLMENT_REFUNDED}
        title="Fulfillment was refunded"
      />
      <TimelineEvent
        date="2026-05-20T10:10:00Z"
        eventType={OrderEventsEnum.FULFILLMENT_RETURNED}
        title="Fulfillment was returned"
        isLastInGroup
      />
    </Box>
  ),
};
