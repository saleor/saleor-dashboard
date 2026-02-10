import type { Meta, StoryObj } from "@storybook/react-vite";

import { CategoryFactory } from "../AssignDialogShared/factories";
import AssignCategoryDialog from "./AssignCategoryDialog";

const noop = () => {};

const meta: Meta<typeof AssignCategoryDialog> = {
  title: "Components/Dialogs/AssignCategoryDialog",
  component: AssignCategoryDialog,
  loaders: [async () => ({ categories: await CategoryFactory.buildList(8) })],
  render: (args, { loaded: { categories } }) => (
    <AssignCategoryDialog {...args} categories={args.categories ?? categories} />
  ),
  args: {
    open: true,
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
  args: { selectionMode: "single" },
};

export const Loading: Story = {
  args: { loading: true, categories: [] },
};

export const Empty: Story = {
  args: { categories: [] },
};

export const HasMore: Story = {
  args: { hasMore: true },
};
