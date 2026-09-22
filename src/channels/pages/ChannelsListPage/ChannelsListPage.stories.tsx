import { channelsList } from "@dashboard/channels/fixtures";
import { ChannelsListUrlSortField } from "@dashboard/channels/urls";
import { limits, limitsReached, sortPageProps } from "@dashboard/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ChannelsListPage } from "./ChannelsListPage";

const shippingZoneCountsByChannelId = new Map(
  channelsList.map((channel, index) => [channel.id, index === 0 ? 0 : 2]),
);

const meta: Meta<typeof ChannelsListPage> = {
  title: "Channels/ChannelsListPage",
  component: ChannelsListPage,
  args: {
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: ChannelsListUrlSortField.name },
    channelsList,
    limits,
    shippingZoneCountsByChannelId,
    onAddChannel: fn(),
    onRemove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ChannelsListPage>;

/** The first channel has no shipping zones, so it carries a setup warning pill. */
export const Default: Story = {};

export const Loading: Story = {
  args: { channelsList: undefined },
};

export const Empty: Story = {
  args: { channelsList: [] },
};

/** MANAGE_SHIPPING missing — no counts, so no coverage column content. */
export const WithoutShippingPermission: Story = {
  args: { shippingZoneCountsByChannelId: undefined },
};

export const ShippingCoverageLoading: Story = {
  args: { shippingZoneCountsByChannelId: undefined, shippingCoverageLoading: true },
};

export const LimitReached: Story = {
  args: { limits: limitsReached },
};
