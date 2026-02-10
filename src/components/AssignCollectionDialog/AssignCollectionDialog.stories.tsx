import type { Meta, StoryObj } from "@storybook/react-vite";

import { CollectionFactory } from "../AssignDialogShared/factories";
import AssignCollectionDialog from "./AssignCollectionDialog";

const noop = () => {};

const meta: Meta<typeof AssignCollectionDialog> = {
  title: "Components/Dialogs/AssignCollectionDialog",
  component: AssignCollectionDialog,
  loaders: [async () => ({ collections: await CollectionFactory.buildList(8) })],
  render: (args, { loaded: { collections } }) => (
    <AssignCollectionDialog {...args} collections={args.collections ?? collections} />
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
type Story = StoryObj<typeof AssignCollectionDialog>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: { selectionMode: "single" },
};

export const Loading: Story = {
  args: { loading: true, collections: [] },
};

export const Empty: Story = {
  args: { collections: [] },
};

export const HasMore: Story = {
  args: { hasMore: true },
};
