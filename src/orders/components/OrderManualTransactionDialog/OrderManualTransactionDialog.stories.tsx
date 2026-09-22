import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderManualTransactionDialog } from "./OrderManualTransactionDialog";

const meta: Meta<typeof OrderManualTransactionDialog> = {
  title: "Orders/Dialogs/OrderManualTransactionDialog",
  component: OrderManualTransactionDialog,
  argTypes: {
    submitState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
  },
  args: {
    dialogProps: { open: true, onClose: fn() },
    currency: "USD",
    submitState: "default",
    error: undefined,
    onAddTransaction: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof OrderManualTransactionDialog>;

export const Default: Story = {};

export const Prefilled: Story = {
  args: {
    initialData: {
      amount: 49.99,
      description: "Refund issued over the phone",
      pspReference: "psp-123456",
    },
  },
};

export const Submitting: Story = { args: { submitState: "loading" } };

export const WithError: Story = {
  args: { error: "Transaction could not be created. Try again." },
};
