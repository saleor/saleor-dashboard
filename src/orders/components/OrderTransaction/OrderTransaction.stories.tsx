import { transactions } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import OrderTransaction from "./OrderTransaction";

const meta: Meta<typeof OrderTransaction> = {
  title: "Orders/OrderTransaction",
  component: OrderTransaction,
  argTypes: {
    transaction: { table: { disable: true } },
    onTransactionAction: { table: { disable: true } },
    fakeEvents: { table: { disable: true } },
    cardFooter: { table: { disable: true } },
  },
  args: {
    onTransactionAction: fn(),
    showActions: true,
    disabled: false,
    defaultExpanded: true,
  },
};

export default meta;
type Story = StoryObj<typeof OrderTransaction>;

export const Preauthorized: Story = {
  args: {
    transaction: { ...transactions.preauthorized[0], index: 0 },
  },
};

export const PendingCharge: Story = {
  args: {
    transaction: { ...transactions.pendingCharge[0], index: 0 },
  },
};

export const ChargeSuccess: Story = {
  args: {
    transaction: { ...transactions.chargeSuccess[0], index: 0 },
  },
};

export const ChargePartial: Story = {
  args: {
    transaction: { ...transactions.chargePartial[0], index: 0 },
  },
};

export const ChargeFailed: Story = {
  args: {
    transaction: { ...transactions.chargeFail[0], index: 0 },
  },
};

export const RefundRequested: Story = {
  args: {
    transaction: { ...transactions.refundRequested[0], index: 0 },
  },
};

export const RefundCompleted: Story = {
  args: {
    transaction: { ...transactions.refundCompleted[0], index: 0 },
  },
};

export const RefundPartial: Story = {
  args: {
    transaction: { ...transactions.refundPartial[0], index: 0 },
  },
};

export const WithExternalUrl: Story = {
  args: {
    transaction: {
      ...transactions.chargeSuccess[0],
      index: 0,
      externalUrl: "https://dashboard.stripe.com/payments/pi_123",
    },
  },
};

export const Disabled: Story = {
  args: {
    transaction: { ...transactions.chargeSuccess[0], index: 0 },
    disabled: true,
  },
};

export const Collapsed: Story = {
  args: {
    transaction: { ...transactions.chargeSuccess[0], index: 0 },
    defaultExpanded: false,
  },
};

export const WithoutActions: Story = {
  args: {
    transaction: { ...transactions.preauthorized[0], index: 0 },
    showActions: false,
  },
};

export const WithCardPaymentMethod: Story = {
  args: {
    transaction: {
      ...transactions.chargeSuccess[0],
      index: 0,
      paymentMethodDetails: {
        __typename: "CardPaymentMethodDetails",
        name: "Credit card",
        brand: "visa",
        expMonth: 12,
        expYear: 2025,
        firstDigits: "4242",
        lastDigits: "4242",
      },
    },
  },
};

export const WithMastercardPaymentMethod: Story = {
  args: {
    transaction: {
      ...transactions.chargeSuccess[0],
      index: 0,
      paymentMethodDetails: {
        __typename: "CardPaymentMethodDetails",
        name: "Credit card",
        brand: "mastercard",
        expMonth: 3,
        expYear: 2026,
        lastDigits: "4444",
      },
    },
  },
};

export const WithOtherPaymentMethod: Story = {
  args: {
    transaction: {
      ...transactions.chargeSuccess[0],
      index: 0,
      paymentMethodDetails: {
        __typename: "OtherPaymentMethodDetails",
        name: "PayPal",
      },
    },
  },
};

export const WithoutPaymentMethod: Story = {
  args: {
    transaction: {
      ...transactions.chargeSuccess[0],
      index: 0,
      paymentMethodDetails: null,
    },
  },
};

export const WithCardFooter: Story = {
  args: {
    transaction: { ...transactions.chargeSuccess[0], index: 0 },
    cardFooter: (
      <div style={{ padding: "12px 20px", borderTop: "1px solid #eee" }}>Custom card footer</div>
    ),
  },
};
