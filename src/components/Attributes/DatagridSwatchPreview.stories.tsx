import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatagridSwatchPreview } from "./DatagridSwatchPreview";

const meta: Meta<typeof DatagridSwatchPreview> = {
  title: "Components/DatagridSwatchPreview",
  component: DatagridSwatchPreview,
  args: {
    colorValue: "#E53935",
    size: 8,
  },
};

export default meta;
type Story = StoryObj<typeof DatagridSwatchPreview>;

export const Color: Story = {};

export const Image: Story = {
  args: {
    colorValue: null,
    fileUrl: "https://placehold.co/32x32/png",
    size: 14,
  },
};

export const Empty: Story = {
  args: {
    colorValue: null,
    fileUrl: null,
  },
};
