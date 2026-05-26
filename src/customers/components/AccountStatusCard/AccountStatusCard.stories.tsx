import { customer } from "@dashboard/customers/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountStatusCard } from "./AccountStatusCard";

const meta: Meta<typeof AccountStatusCard> = {
  title: "Customers/AccountStatusCard",
  component: AccountStatusCard,
};

export default meta;
type Story = StoryObj<typeof AccountStatusCard>;

export const Default: Story = {
  args: {
    customer,
  },
};

export const InactiveAndUnverified: Story = {
  args: {
    customer: {
      ...customer,
      isActive: false,
      isConfirmed: false,
    },
  },
};

export const ActiveButUnverified: Story = {
  args: {
    customer: {
      ...customer,
      isActive: true,
      isConfirmed: false,
    },
  },
};

export const Loading: Story = {
  args: {
    customer: null,
  },
};
