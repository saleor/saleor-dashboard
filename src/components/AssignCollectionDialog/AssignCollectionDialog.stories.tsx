import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentProps } from "react";
import { fn } from "storybook/test";

import { CollectionFactory } from "../AssignDialogShared/factories";
import AssignCollectionDialog from "./AssignCollectionDialog";

type Props = ComponentProps<typeof AssignCollectionDialog>;

const meta: Meta<typeof AssignCollectionDialog> = {
  title: "Components/Dialogs/AssignCollectionDialog",
  component: AssignCollectionDialog,
  loaders: [async () => ({ collections: await CollectionFactory.buildList(8) })],
  render: (args: Props, { loaded }: { loaded: { collections: Props["collections"] } }) => (
    <AssignCollectionDialog {...args} collections={args.collections ?? loaded.collections} />
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
    collections: { table: { disable: true } },
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
