import { Meta, StoryObj } from "@storybook/react";

import { Spinner } from ".";

const meta: Meta<typeof Spinner> = {
  title: "Components / Spinner",
  tags: ["autodocs"],
  component: Spinner,
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
