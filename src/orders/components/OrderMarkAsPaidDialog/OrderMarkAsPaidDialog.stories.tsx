import { OrderErrorCode } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { OrderMarkAsPaidDialog } from "./OrderMarkAsPaidDialog";

const meta: Meta<typeof OrderMarkAsPaidDialog> = {
  title: "Orders/Dialogs/OrderMarkAsPaidDialog",
  component: OrderMarkAsPaidDialog,
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
  },
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    transactionReference: "",
    onClose: fn(),
    onConfirm: fn(),
    handleTransactionReference: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof OrderMarkAsPaidDialog>;

const Interactive = () => {
  const [transactionReference, setTransactionReference] = useState("");

  return (
    <OrderMarkAsPaidDialog
      open
      confirmButtonState="default"
      errors={[]}
      transactionReference={transactionReference}
      onClose={fn()}
      onConfirm={fn()}
      handleTransactionReference={event => setTransactionReference(event.target.value)}
    />
  );
};

export const Default: Story = { render: () => <Interactive /> };

export const Submitting: Story = { args: { confirmButtonState: "loading" } };

export const WithError: Story = {
  args: {
    errors: [
      {
        __typename: "OrderError",
        code: OrderErrorCode.REQUIRED,
        field: "transactionReference",
        addressType: null,
        orderLines: null,
        message: "Transaction reference is required",
      },
    ],
  },
};
