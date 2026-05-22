import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Chip from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  args: {
    label: "Tag label",
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const WithCloseButton: Story = {
  args: {
    onClose: fn(),
  },
};

export const LongLabel: Story = {
  args: {
    label: "A much longer chip label that still fits on one line",
    onClose: fn(),
  },
};
