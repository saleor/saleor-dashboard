import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, useState } from "react";
import { fn } from "storybook/test";

import { type ChannelSectionId, channelSectionIds } from "./channelSectionIds";
import { ChannelSectionNav, type ChannelSectionNavItem } from "./ChannelSectionNav";

const items: ChannelSectionNavItem[] = [
  { id: channelSectionIds.general, label: "General" },
  { id: channelSectionIds.orders, label: "Orders" },
  { id: channelSectionIds.payments, label: "Payments & checkout" },
  { id: channelSectionIds.paymentGateways, label: "Payment gateways" },
  { id: channelSectionIds.catalog, label: "Catalog" },
  { id: channelSectionIds.taxes, label: "Taxes" },
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
    (Story: ComponentType) => (
      <Box padding={6} backgroundColor="default1">
        <Story />
      </Box>
    ),
  ],
};

export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState<ChannelSectionId>(channelSectionIds.general);

    return (
      <Box padding={6} backgroundColor="default1">
        <ChannelSectionNav items={items} activeId={activeId} onSelect={setActiveId} />
      </Box>
    );
  },
};
