import { customer } from "@dashboard/customers/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import CustomerDetails from "./CustomerDetails";

const meta: Meta<typeof CustomerDetails> = {
  title: "Customers/CustomerDetails",
  component: CustomerDetails,
};

export default meta;
type Story = StoryObj<typeof CustomerDetails>;

const defaultProps = {
  customer: customer,
  data: {
    isActive: true,
    note: "Very important customer",
  },
  disabled: false,
  errors: [],
  onChange: fn(),
};

export const Default: Story = {
  args: defaultProps,
};

export const Loading: Story = {
  args: {
    ...defaultProps,
    customer: null,
  },
};

export const Inactive: Story = {
  args: {
    ...defaultProps,
    data: {
      isActive: false,
      note: "",
    },
  },
};

export const Disabled: Story = {
  args: {
    ...defaultProps,
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    ...defaultProps,
    errors: [
      {
        __typename: "AccountError" as const,
        code: "INVALID" as any,
        field: "note",
        addressType: null,
        message: "This field is required",
      },
    ],
  },
};

export const EmptyNote: Story = {
  args: {
    ...defaultProps,
    data: {
      isActive: true,
      note: "",
    },
  },
};
