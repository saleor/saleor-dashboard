import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoginLoading } from "./LoginLoading";

const meta: Meta<typeof LoginLoading> = {
  title: "Auth / LoginLoading",
  component: LoginLoading,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LoginLoading>;

export const Default: Story = {};
