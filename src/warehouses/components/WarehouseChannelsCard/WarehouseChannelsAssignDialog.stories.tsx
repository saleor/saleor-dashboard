import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { WarehouseChannelsAssignDialog } from "./WarehouseChannelsAssignDialog";

const meta: Meta<typeof WarehouseChannelsAssignDialog> = {
  title: "Warehouses/WarehouseChannelsAssignDialog",
  component: WarehouseChannelsAssignDialog,
  args: {
    channels: [
      { id: "ch-eu", name: "Europe" },
      { id: "ch-us", name: "United States" },
      { id: "ch-uk", name: "United Kingdom" },
    ],
    open: true,
    confirming: false,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseChannelsAssignDialog>;

export const Default: Story = {};

export const Confirming: Story = {
  args: { confirming: true },
};

export const ManyChannels: Story = {
  args: {
    channels: Array.from({ length: 60 }, (_, index) => ({
      id: `ch-${index}`,
      name: `Channel ${index + 1}`,
    })),
  },
};
