import { AllocationStrategyEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ChannelInventoryCard } from "./ChannelInventoryCard";

const warehouses = [
  { id: "1", name: "Barcelona Overflow" },
  { id: "2", name: "Lisbon Returns" },
  { id: "3", name: "Madrid Central" },
  { id: "4", name: "Porto Fulfillment" },
];

const meta: Meta<typeof ChannelInventoryCard> = {
  title: "Channels / ChannelInventoryCard",
  component: ChannelInventoryCard,
  args: {
    warehouses,
    removeWarehouse: fn(),
    reorderWarehouses: fn(),
    disabled: false,
    availableWarehousesCount: 6,
    canCreateWarehouse: true,
    onAssignWarehouse: fn(),
    onCreateWarehouse: fn(),
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
    onAllocationStrategyChange: fn(),
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
type Story = StoryObj<typeof ChannelInventoryCard>;

export const WithWarehouses: Story = {};

export const Empty: Story = {
  args: {
    warehouses: [],
    availableWarehousesCount: 3,
  },
};

export const EmptyCreateOnly: Story = {
  args: {
    warehouses: [],
    availableWarehousesCount: 0,
    canCreateWarehouse: true,
  },
};
