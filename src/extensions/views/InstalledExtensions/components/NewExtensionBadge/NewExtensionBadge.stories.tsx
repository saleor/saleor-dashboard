import type { Meta, StoryObj } from "@storybook/react-vite";

import { NewExtensionBadge } from "./NewExtensionBadge";

const meta: Meta<typeof NewExtensionBadge> = {
  title: "Extensions/NewExtensionBadge",
  component: NewExtensionBadge,
};

export default meta;

type Story = StoryObj<typeof NewExtensionBadge>;

export const Default: Story = {};
