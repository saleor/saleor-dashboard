import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppActionsMenu } from "./AppActionsMenu";

const meta: Meta<typeof AppActionsMenu> = {
  title: "Extensions/Manage app/Actions menu",
  component: AppActionsMenu,
  args: {
    isActive: true,
    onAppActivateOpen: () => undefined,
    onAppDeactivateOpen: () => undefined,
    onAppDeleteOpen: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof AppActionsMenu>;

export const Active: Story = {};

export const Inactive: Story = { args: { isActive: false } };
