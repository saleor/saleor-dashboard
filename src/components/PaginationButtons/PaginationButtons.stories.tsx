import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { PaginationButtons } from "./PaginationButtons";

const meta: Meta<typeof PaginationButtons> = {
  title: "Components / PaginationButtons",
  component: PaginationButtons,
  args: {
    hasPreviousPage: true,
    hasNextPage: true,
    onPreviousPage: fn(),
    onNextPage: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PaginationButtons>;

export const Default: Story = {};

export const FirstPage: Story = {
  args: {
    hasPreviousPage: false,
  },
};

export const LastPage: Story = {
  args: {
    hasNextPage: false,
  },
};
