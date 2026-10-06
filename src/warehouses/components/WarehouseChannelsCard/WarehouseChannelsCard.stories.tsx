import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { WarehouseChannelsCard } from "./WarehouseChannelsCard";

const meta: Meta<typeof WarehouseChannelsCard> = {
  title: "Warehouses / WarehouseChannelsCard",
  component: WarehouseChannelsCard,
  decorators: [
    (Story: StoryFn): ReactElement => (
      <Box __maxWidth="420px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    status: "ready",
    channels: [],
    availableChannels: [
      { id: "ch-eu", name: "Europe" },
      { id: "ch-us", name: "United States" },
    ],
    canManage: true,
    disabled: false,
    onRetry: fn(),
    onRequestAssign: fn(),
    onRemove: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseChannelsCard>;

export const Empty: Story = {};

export const Assigned: Story = {
  args: {
    channels: [{ id: "ch-eu", name: "Europe" }],
    availableChannels: [{ id: "ch-us", name: "United States" }],
  },
};

export const ReadOnly: Story = {
  args: {
    channels: [{ id: "ch-eu", name: "Europe" }],
    canManage: false,
  },
};

export const Failed: Story = {
  args: {
    status: "error",
  },
};
