import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ChannelDeliveryCard } from "./ChannelDeliveryCard";

const shippingZones = [
  { id: "1", name: "EU Standard" },
  { id: "2", name: "Iberia Express" },
];

const meta: Meta<typeof ChannelDeliveryCard> = {
  title: "Channels / ChannelDeliveryCard",
  component: ChannelDeliveryCard,
  args: {
    shippingZones,
    removeShippingZone: fn(),
    disabled: false,
    availableShippingZonesCount: 5,
    canCreateShipping: true,
    onAssignShipping: fn(),
    onCreateShipping: fn(),
  },
  decorators: [
    (Story: ComponentType) => (
      <Box padding={6} __maxWidth="420px" backgroundColor="default1">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChannelDeliveryCard>;

export const WithZones: Story = {};

export const Empty: Story = {
  args: {
    shippingZones: [],
    availableShippingZonesCount: 3,
  },
};
