import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { WarehouseShippingZonesAllDialog } from "./WarehouseShippingZonesAllDialog";

const meta: Meta<typeof WarehouseShippingZonesAllDialog> = {
  title: "Warehouses / WarehouseShippingZonesAllDialog",
  component: WarehouseShippingZonesAllDialog,
  args: {
    open: true,
    zones: Array.from({ length: 50 }, (_, index) => ({
      id: `zone-${index}`,
      name: `Zone ${index + 1}`,
      channelIds: [index % 10 === 0 ? "ch-us" : "ch-eu"],
    })),
    loading: false,
    hasMore: true,
    warehouseChannelIds: ["ch-eu"],
    canManage: true,
    disabled: false,
    onFetchMore: fn(),
    onRemove: fn(),
    onClose: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseShippingZonesAllDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: { zones: [], loading: true },
};
