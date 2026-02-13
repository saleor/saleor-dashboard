import type { Meta, StoryObj } from "@storybook/react-vite";
import { withFilterApolloMocks } from "@storybookUtils/AssignDialogShared/decorators";
import { ProductFactory } from "@storybookUtils/AssignDialogShared/factories";
import { ComponentProps } from "react";
import { fn } from "storybook/test";

import AssignVariantDialog from "./AssignVariantDialog";

type Props = ComponentProps<typeof AssignVariantDialog>;

const meta: Meta<typeof AssignVariantDialog> = {
  title: "Components/Dialogs/AssignVariantDialog",
  component: AssignVariantDialog,
  decorators: [withFilterApolloMocks],
  loaders: [async () => ({ products: await ProductFactory.buildList(4) })],
  render: (args: Props, { loaded }: { loaded: { products: Props["products"] } }) => (
    <AssignVariantDialog {...args} products={args.products ?? loaded.products} />
  ),
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    onFilterChange: { table: { disable: true } },
    products: { table: { disable: true } },
    selectedIds: { table: { disable: true } },
    excludedFilters: { table: { disable: true } },
    initialConstraints: { table: { disable: true } },
    labels: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
    onFilterChange: fn(),
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

export const WithLockedProductType: Story = {
  args: {
    initialConstraints: {
      productTypes: [{ id: "product-type-1", name: "Simple Product" }],
    },
  },
};
