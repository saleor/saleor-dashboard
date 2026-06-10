import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { TablePagination } from "./TablePagination";

const meta: Meta<typeof TablePagination> = {
  title: "Components/TablePagination",
  component: TablePagination,
  args: {
    hasPreviousPage: true,
    hasNextPage: true,
    onPreviousPage: fn(),
    onNextPage: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TablePagination>;

export const Default: Story = {};

export const FirstPage: Story = {
  args: {
    hasPreviousPage: false,
    hasNextPage: true,
  },
};

export const LastPage: Story = {
  args: {
    hasPreviousPage: true,
    hasNextPage: false,
  },
};

export const WithRowNumberSelect: Story = {
  args: {
    rowNumber: 20,
    onRowNumberChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    rowNumber: 20,
    onRowNumberChange: fn(),
  },
};
