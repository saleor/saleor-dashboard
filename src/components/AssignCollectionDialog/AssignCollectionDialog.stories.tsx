import type { Meta, StoryObj } from "@storybook/react-vite";

import AssignCollectionDialog from "./AssignCollectionDialog";

const mockCollections = [
  { id: "col-1", name: "Summer Sale 2024" },
  { id: "col-2", name: "New Arrivals" },
  { id: "col-3", name: "Best Sellers" },
  { id: "col-4", name: "Featured Products" },
  { id: "col-5", name: "Clearance" },
  { id: "col-6", name: "Gift Guide" },
  { id: "col-7", name: "Staff Picks" },
  { id: "col-8", name: "Eco-Friendly" },
];

const noop = () => {};

const meta: Meta<typeof AssignCollectionDialog> = {
  title: "Components/Dialogs/AssignCollectionDialog",
  component: AssignCollectionDialog,
  args: {
    open: true,
    collections: mockCollections,
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
  args: {
    selectionMode: "single",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    collections: [],
  },
};

export const Empty: Story = {
  args: {
    collections: [],
  },
};

export const HasMore: Story = {
  args: {
    hasMore: true,
  },
};
