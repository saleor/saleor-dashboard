import type { Meta, StoryObj } from "@storybook/react-vite";

import { DATAGRID_SWATCH_SIZE, DatagridSwatchPreview } from "./DatagridSwatchPreview";

const meta: Meta<typeof DatagridSwatchPreview> = {
  title: "Components/DatagridSwatchPreview",
  component: DatagridSwatchPreview,
  args: {
    colorValue: "#2563EB",
    size: DATAGRID_SWATCH_SIZE,
  },
};

export default meta;
type Story = StoryObj<typeof DatagridSwatchPreview>;

export const Color: Story = {};

export const LightColor: Story = {
  args: {
    colorValue: "#FFFFFF",
  },
};

export const Image: Story = {
  args: {
    colorValue: null,
    fileUrl: "https://placehold.co/32x32/png",
  },
};

export const Empty: Story = {
  args: {
    colorValue: null,
    fileUrl: null,
  },
};
