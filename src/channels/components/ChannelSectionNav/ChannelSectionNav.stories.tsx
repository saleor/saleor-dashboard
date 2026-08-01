import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { channelSectionIds } from "./channelSectionIds";
import { ChannelSectionNav, type ChannelSectionNavItem } from "./ChannelSectionNav";

const items: ChannelSectionNavItem[] = [
  { id: channelSectionIds.general, label: "General" },
  { id: channelSectionIds.orders, label: "Orders" },
  { id: channelSectionIds.payments, label: "Payments" },
];

const meta: Meta<typeof ChannelSectionNav> = {
  title: "Channels / ChannelSectionNav",
  component: ChannelSectionNav,
};

export default meta;
type Story = StoryObj<typeof ChannelSectionNav>;

export const Default: Story = {
  args: {
    items,
    activeId: channelSectionIds.orders,
    onSelect: fn(),
  },
  decorators: [
    Story => (
      <Box padding={6} backgroundColor="default1">
        <Story />
      </Box>
    ),
  ],
};

export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState(channelSectionIds.general);

    return (
      <Box padding={6} backgroundColor="default1">
        <ChannelSectionNav items={items} activeId={activeId} onSelect={setActiveId} />
      </Box>
    );
  },
};
