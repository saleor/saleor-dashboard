import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductFactory } from "../AssignDialogShared/factories";
import { AssignProductDialog } from "./AssignProductDialog";

const noop = () => {};

const meta: Meta<typeof AssignProductDialog> = {
  title: "Components/Dialogs/AssignProductDialog",
  component: AssignProductDialog,
  loaders: [async () => ({ products: await ProductFactory.buildList(6) })],
  render: (args, { loaded: { products } }) => (
    <AssignProductDialog {...args} products={args.products ?? products} />
  ),
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: noop,
    onFetchMore: noop,
    onSubmit: noop,
    onFilterChange: noop,
  },
};

export default meta;
type Story = StoryObj<typeof AssignProductDialog>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: { selectionMode: "single" },
};

export const Loading: Story = {
  args: { loading: true, products: [] },
};

export const Empty: Story = {
  args: { products: [] },
};

export const WithUnavailableProducts: Story = {
  args: {
    selectedChannels: [{ id: "channel-unavailable" }],
    productUnavailableText: "Not available in selected channels",
  },
};
