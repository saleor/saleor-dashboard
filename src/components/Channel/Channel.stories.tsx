import type { Meta, StoryObj } from "@storybook/react-vite";

import { Channel } from "./Channel";

const meta: Meta<typeof Channel> = {
  title: "Components/Channel",
  component: Channel,
  args: {
    channel: { id: "Q2hhbm5lbDox", name: "Channel-USD", isActive: true },
  },
};

export default meta;
type Story = StoryObj<typeof Channel>;

export const Default: Story = {};

export const Inactive: Story = {
  args: {
    channel: { id: "Q2hhbm5lbDox", name: "Channel-USD", isActive: false },
  },
};

export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const AsLink: Story = {
  args: {
    href: "/orders?asGridString0=channel.is.input-5.Q2hhbm5lbDox.channel-usd",
  },
};

export const LargerSize: Story = {
  args: {
    size: 4,
    color: "default1",
  },
};

export const Loading: Story = {
  args: {
    channel: undefined,
  },
};

export const LongName: Story = {
  args: {
    channel: {
      id: "Q2hhbm5lbDox",
      name: "European Union Storefront Channel (EUR)",
      isActive: true,
    },
  },
};
