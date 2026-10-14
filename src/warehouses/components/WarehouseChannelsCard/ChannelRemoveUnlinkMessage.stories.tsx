import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChannelRemoveUnlinkMessage } from "./ChannelRemoveUnlinkMessage";

const meta: Meta<typeof ChannelRemoveUnlinkMessage> = {
  title: "Warehouses/ChannelRemoveUnlinkMessage",
  component: ChannelRemoveUnlinkMessage,
  args: {
    zoneNames: ["Europe", "Nordics"],
    truncated: false,
  },
};

export default meta;
type Story = StoryObj<typeof ChannelRemoveUnlinkMessage>;

export const NamedZones: Story = {};

export const NamedZonesWithMore: Story = {
  args: { truncated: true },
};

export const TooManyZonesToCheck: Story = {
  args: { zoneNames: [], truncated: true },
};
