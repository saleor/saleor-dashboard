import type { Meta, StoryObj } from "@storybook/react-vite";
import { CategoryFactory } from "@storybookUtils/AssignDialogShared/factories";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import AssignCategoryDialog from "./AssignCategoryDialog";

type Props = ComponentProps<typeof AssignCategoryDialog>;

const meta: Meta<typeof AssignCategoryDialog> = {
  title: "Components/Dialogs/AssignCategoryDialog",
  component: AssignCategoryDialog,
  loaders: [async () => ({ categories: await CategoryFactory.buildList(8) })],
  render: (args: Props, { loaded }: { loaded: { categories: Props["categories"] } }) => (
    <AssignCategoryDialog {...args} categories={args.categories ?? loaded.categories} />
  ),
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetch: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    categories: { table: { disable: true } },
    labels: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
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
