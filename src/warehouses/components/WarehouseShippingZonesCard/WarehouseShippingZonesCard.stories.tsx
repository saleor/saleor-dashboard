import { type ZoneChannelMembership } from "@dashboard/warehouses/zonesUnlinkedByChannelRemoval";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { WarehouseShippingZonesCard } from "./WarehouseShippingZonesCard";

const europeZone: ZoneChannelMembership = {
  id: "zone-eu",
  name: "Europe",
  channelIds: ["ch-eu"],
};

const germanyZone: ZoneChannelMembership = {
  id: "zone-de",
  name: "Germany",
  channelIds: ["ch-eu"],
};

const americasZone: ZoneChannelMembership = {
  id: "zone-us",
  name: "Americas",
  channelIds: ["ch-us"],
};

const meta: Meta<typeof WarehouseShippingZonesCard> = {
  title: "Warehouses / WarehouseShippingZonesCard",
  component: WarehouseShippingZonesCard,
  decorators: [
    (Story: StoryFn): ReactElement => (
      <Box __maxWidth="420px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    legacyStockAvailability: true,
    zones: [],
    totalCount: null,
    loading: false,
    membershipStatus: "ready",
    warehouseChannelIds: ["ch-eu"],
    channelNames: ["Europe"],
    pickupEnabled: false,
    canManage: true,
    disabled: false,
    onRequestAssign: fn(),
    onRemove: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseShippingZonesCard>;

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const DirectStockMode: Story = {
  args: {
    legacyStockAvailability: false,
    zones: [europeZone, americasZone],
  },
};

export const LegacyNeedsChannel: Story = {
  args: {
    warehouseChannelIds: [],
    channelNames: [],
  },
};

export const LegacyMembershipUnknown: Story = {
  args: {
    membershipStatus: "error",
  },
};

export const LegacyNeedsZone: Story = {
  args: {
    pickupEnabled: true,
  },
};

export const LegacyLinkedWithOutsideChannelZone: Story = {
  args: {
    zones: [europeZone, americasZone],
  },
};

export const Truncated: Story = {
  args: {
    zones: [europeZone, germanyZone],
    totalCount: 12,
  },
};

export const ReadOnly: Story = {
  args: {
    zones: [europeZone],
    canManage: false,
  },
};
