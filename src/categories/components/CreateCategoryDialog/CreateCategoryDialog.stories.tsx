import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateCategoryDialog } from "./CreateCategoryDialog";

const meta: Meta<typeof CreateCategoryDialog> = {
  title: "Categories / CreateCategoryDialog",
  component: CreateCategoryDialog,
};

export default meta;

type Story = StoryObj<typeof CreateCategoryDialog>;

export const Root: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};

export const Subcategory: Story = {
  args: {
    open: true,
    parentId: "Q2F0ZWdvcnk6MQ==",
    parentName: "Apparel",
    confirmButtonState: "default",
    errors: [],
    onClose: () => undefined,
    onSubmit: async () => [],
  },
};
