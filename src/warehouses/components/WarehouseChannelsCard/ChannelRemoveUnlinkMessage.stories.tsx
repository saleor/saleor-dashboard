import type { Meta, StoryObj } from "@storybook/react-vite";

import { ChannelRemoveUnlinkMessage } from "./ChannelRemoveUnlinkMessage";

const meta: Meta<typeof ChannelRemoveUnlinkMessage> = {
  title: "Warehouses/ChannelRemoveUnlinkMessage",
  component: ChannelRemoveUnlinkMessage,
  args: {
    zoneNames: ["Europe", "Nordics"],
  },
};

export default meta;
type Story = StoryObj<typeof ChannelRemoveUnlinkMessage>;

export const NamedZones: Story = {};

export const ManyZones: Story = {
  args: {
    zoneNames: Array.from({ length: 23 }, (_, index) => `Zone ${index + 1}`),
  },
};

export const CheckFailed: Story = {
  args: { zoneNames: null },
};
