import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  giftCardBoughtPartialFixture,
  giftCardExpiredFixture,
  giftCardIssuedUnusedFixture,
} from "../fixtures";
import { GiftCardBalanceCardView } from "./GiftCardBalanceCardView";

const meta: Meta<typeof GiftCardBalanceCardView> = {
  title: "GiftCards/GiftCardBalanceCard",
  component: GiftCardBalanceCardView,
  args: {
    onSetBalance: fn(),
  },
  decorators: [
    // Use px — dashboard html font-size (~8px) makes rem tiny in Storybook.
    (Story: StoryFn): JSX.Element => (
      <Box __width="480px" padding={4}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GiftCardBalanceCardView>;

export const IssuedUnused: Story = {
  args: {
    giftCard: giftCardIssuedUnusedFixture,
  },
};

export const PartiallySpentWithLastUsed: Story = {
  args: {
    giftCard: giftCardBoughtPartialFixture,
  },
};

export const Expired: Story = {
  args: {
    giftCard: giftCardExpiredFixture,
  },
};

export const Loading: Story = {
  args: {
    giftCard: undefined,
    loading: true,
  },
};
