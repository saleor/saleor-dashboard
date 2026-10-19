import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { WarehouseSetupChecklist } from "./WarehouseSetupChecklist";

const meta: Meta<typeof WarehouseSetupChecklist> = {
  title: "Warehouses / WarehouseSetupChecklist",
  component: WarehouseSetupChecklist,
  decorators: [
    (Story: StoryFn): ReactElement => (
      <Box __maxWidth="720px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    canManage: true,
    canManageShipping: true,
    inChannel: false,
    showShippingZones: false,
    zoneCount: 0,
    onAddChannel: fn(),
    onAddShippingZone: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseSetupChecklist>;

export const NotInChannel: Story = {};

export const NeedsShippingZone: Story = {
  args: {
    inChannel: true,
    showShippingZones: true,
    zoneCount: 0,
  },
};

export const Ready: Story = {
  args: {
    inChannel: true,
    showShippingZones: true,
    zoneCount: 1,
    onDismiss: fn(),
  },
};

export const ReadyDirectStockMode: Story = {
  args: {
    inChannel: true,
    onDismiss: fn(),
  },
};

export const ReadOnly: Story = {
  args: {
    canManage: false,
    canManageShipping: false,
    showShippingZones: true,
  },
};
