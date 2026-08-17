import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import {
  giftCardBoughtByEmailFixture,
  giftCardBoughtPartialFixture,
  giftCardChannelFixture,
  giftCardIssuedByAppFixture,
  giftCardIssuedUnusedFixture,
} from "../fixtures";
import { GiftCardProvenanceCardView } from "./GiftCardProvenanceCardView";

const meta: Meta<typeof GiftCardProvenanceCardView> = {
  title: "GiftCards/GiftCardProvenanceCard",
  component: GiftCardProvenanceCardView,
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
type Story = StoryObj<typeof GiftCardProvenanceCardView>;

export const StaffIssued: Story = {
  args: {
    giftCard: giftCardIssuedUnusedFixture,
  },
};

export const IssuedByApp: Story = {
  args: {
    giftCard: giftCardIssuedByAppFixture,
  },
};

export const BoughtWithProductAndOrder: Story = {
  args: {
    giftCard: giftCardBoughtPartialFixture,
    channel: giftCardChannelFixture,
  },
};

export const BoughtByGuestEmail: Story = {
  args: {
    giftCard: giftCardBoughtByEmailFixture,
    channel: giftCardChannelFixture,
  },
};

export const BoughtChannelSlugOnly: Story = {
  args: {
    giftCard: giftCardBoughtPartialFixture,
    channel: null,
  },
};

export const Loading: Story = {
  args: {
    giftCard: undefined,
    loading: true,
  },
};
