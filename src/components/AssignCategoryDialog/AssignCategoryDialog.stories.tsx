import type { Meta, StoryObj } from "@storybook/react-vite";

import AssignCategoryDialog from "./AssignCategoryDialog";

const mockCategories = [
  { id: "cat-1", name: "Apparel" },
  { id: "cat-2", name: "Electronics" },
  { id: "cat-3", name: "Home & Garden" },
  { id: "cat-4", name: "Sports & Outdoors" },
  { id: "cat-5", name: "Books & Media" },
  { id: "cat-6", name: "Health & Beauty" },
  { id: "cat-7", name: "Toys & Games" },
  { id: "cat-8", name: "Food & Beverages" },
];

const noop = () => {};

const meta: Meta<typeof AssignCategoryDialog> = {
  title: "Components/Dialogs/AssignCategoryDialog",
  component: AssignCategoryDialog,
  args: {
    open: true,
    categories: mockCategories,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: noop,
    onFetch: noop,
    onFetchMore: noop,
    onSubmit: noop,
  },
};

export default meta;
type Story = StoryObj<typeof AssignCategoryDialog>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: {
    selectionMode: "single",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    categories: [],
  },
};

export const Empty: Story = {
  args: {
    categories: [],
  },
};

export const HasMore: Story = {
  args: {
    hasMore: true,
  },
};
