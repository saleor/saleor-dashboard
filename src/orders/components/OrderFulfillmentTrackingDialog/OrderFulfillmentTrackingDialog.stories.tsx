import { OrderErrorCode } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderFulfillmentTrackingDialog } from "./OrderFulfillmentTrackingDialog";

const meta: Meta<typeof OrderFulfillmentTrackingDialog> = {
  title: "Orders/Dialogs/OrderFulfillmentTrackingDialog",
  component: OrderFulfillmentTrackingDialog,
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
    trackingNumber: "",
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof OrderFulfillmentTrackingDialog>;

export const Default: Story = {};

export const WithTrackingNumber: Story = { args: { trackingNumber: "1Z999AA10123456784" } };

export const Submitting: Story = { args: { confirmButtonState: "loading" } };

export const WithError: Story = {
  args: {
    errors: [
      {
        __typename: "OrderError",
        code: OrderErrorCode.INVALID,
        field: "trackingNumber",
        addressType: null,
        orderLines: null,
        message: "Tracking number is invalid",
      },
    ],
  },
};
