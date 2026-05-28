import { TransactionEventTypeEnum } from "@dashboard/graphql";
import { transactions } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { TransactionEvents } from "./TransactionEvents";

const meta: Meta<typeof TransactionEvents> = {
  title: "Orders/OrderTransaction/TransactionEvents",
  component: TransactionEvents,
  argTypes: {
    events: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof TransactionEvents>;

export const Preauthorized: Story = {
  args: {
    events: transactions.preauthorized[0].events,
  },
};

export const ChargeSuccess: Story = {
  args: {
    events: transactions.chargeSuccess[0].events,
  },
};

export const ChargeFailed: Story = {
  args: {
    events: transactions.chargeFail[0].events,
  },
};

export const RefundCompleted: Story = {
  args: {
    events: transactions.refundCompleted[0].events,
  },
};

export const RefundPartial: Story = {
  args: {
    events: transactions.refundPartial[0].events,
  },
};

export const MultipleEvents: Story = {
  args: {
    events: [
      ...transactions.preauthorized[0].events,
      ...transactions.chargeSuccess[0].events,
      ...transactions.refundCompleted[0].events,
    ],
  },
};

export const WithExternalUrl: Story = {
  args: {
    events: transactions.chargeSuccess[0].events.map(event => ({
      ...event,
      externalUrl: "https://dashboard.stripe.com/payments/pi_123",
    })),
  },
};

export const WithLongMessage: Story = {
  args: {
    events: [
      {
        ...transactions.chargeSuccess[0].events[0],
        message:
          "This is a very long message describing what happened during the transaction event, used to verify how the message column handles overflow and line clamping in the table layout.",
      },
    ],
  },
};

export const InfoEvent: Story = {
  args: {
    events: [
      {
        ...transactions.chargeSuccess[0].events[0],
        type: TransactionEventTypeEnum.INFO,
        message: "Additional information about the payment",
      },
    ],
  },
};

export const NoEvents: Story = {
  args: {
    events: [],
  },
};
