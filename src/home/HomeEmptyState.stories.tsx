import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeEmptyState } from "./HomeEmptyState";

const meta: Meta<typeof HomeEmptyState> = {
  title: "Home / HomeEmptyState",
  component: HomeEmptyState,
};

export default meta;

type Story = StoryObj<typeof HomeEmptyState>;

export const Default: Story = {};
