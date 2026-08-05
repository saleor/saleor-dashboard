import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  giftCardAssignedCustomerFixture,
  giftCardBoughtPartialFixture,
  giftCardEmailOnlyAssignFixture,
} from "../fixtures";
import { GiftCardAssignedCustomerCardView } from "./GiftCardAssignedCustomerCardView";

const meta: Meta<typeof GiftCardAssignedCustomerCardView> = {
  title: "GiftCards/GiftCardAssignedCustomerCard",
  component: GiftCardAssignedCustomerCardView,
  args: {
    onAssign: fn(),
    onRemove: fn(),
  },
  decorators: [
    // Use px — dashboard html font-size (~8px) makes rem tiny in Storybook.
    (Story: StoryFn): JSX.Element => (
      <Box __width="420px" padding={4}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GiftCardAssignedCustomerCardView>;

export const Unrestricted: Story = {
  args: {
    giftCard: {
      ...giftCardBoughtPartialFixture,
      assignedTo: null,
      assignedToEmail: null,
    },
  },
};

export const AssignedCustomer: Story = {
  args: {
    giftCard: giftCardAssignedCustomerFixture,
  },
};

export const EmailOnlyRestriction: Story = {
  args: {
    giftCard: giftCardEmailOnlyAssignFixture,
  },
};
