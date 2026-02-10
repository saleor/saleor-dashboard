import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductFactory } from "../AssignDialogShared/factories";
import AssignVariantDialog from "./AssignVariantDialog";

const noop = () => {};

const meta: Meta<typeof AssignVariantDialog> = {
  title: "Components/Dialogs/AssignVariantDialog",
  component: AssignVariantDialog,
  loaders: [async () => ({ products: await ProductFactory.buildList(4) })],
  render: (args, { loaded: { products } }) => (
    <AssignVariantDialog {...args} products={args.products ?? products} />
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
type Story = StoryObj<typeof AssignVariantDialog>;

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
