import type { Meta, StoryObj } from "@storybook/react-vite";

import { WarehouseSaveCompositionHint } from "./WarehouseSaveCompositionHint";

const meta: Meta<typeof WarehouseSaveCompositionHint> = {
  title: "Warehouses/WarehouseSaveCompositionHint",
  component: WarehouseSaveCompositionHint,
  args: {
    composition: { hasGeneral: true, hasAddress: false, hasPickup: false },
  },
};

export default meta;

type Story = StoryObj<typeof WarehouseSaveCompositionHint>;

export const GeneralOnly: Story = {};

export const AllSections: Story = {
  args: { composition: { hasGeneral: true, hasAddress: true, hasPickup: true } },
};

export const NothingChanged: Story = {
  args: { composition: { hasGeneral: false, hasAddress: false, hasPickup: false } },
};
