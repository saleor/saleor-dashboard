import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { WarehouseChannelsCard } from "../WarehouseChannelsCard/WarehouseChannelsCard";
import { WarehouseDetailsPageLoading } from "./WarehouseDetailsPageLoading";

const meta: Meta<typeof WarehouseDetailsPageLoading> = {
  title: "Warehouses/WarehouseDetailsPageLoading",
  component: WarehouseDetailsPageLoading,
  args: {
    channelsCard: (
      <WarehouseChannelsCard
        status="loading"
        channels={[]}
        availableChannels={[]}
        canManage={false}
        disabled
        onRetry={fn()}
        onRequestAssign={fn()}
        onRemove={fn()}
      />
    ),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseDetailsPageLoading>;

export const Loading: Story = {};

export const LoadFailed: Story = {
  args: { onRetry: fn() },
};
