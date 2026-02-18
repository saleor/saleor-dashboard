import type { Meta, StoryObj } from "@storybook/react-vite";
import { withFilterApolloMocks } from "@storybookUtils/AssignDialogShared/decorators";
import { ProductFactory } from "@storybookUtils/AssignDialogShared/factories";
import { ComponentProps } from "react";
import { fn } from "storybook/test";

import { AssignProductDialog } from "./AssignProductDialog";

type Props = ComponentProps<typeof AssignProductDialog>;

const meta: Meta<typeof AssignProductDialog> = {
  title: "Components/Dialogs/AssignProductDialog",
  component: AssignProductDialog,
  decorators: [withFilterApolloMocks],
  loaders: [async () => ({ products: await ProductFactory.buildList(6) })],
  render: (args: Props, { loaded }: { loaded: { products: Props["products"] } }) => (
    <AssignProductDialog {...args} products={args.products ?? loaded.products} />
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
    selectedChannels: { table: { disable: true } },
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

export const WithLockedProductType: Story = {
  args: {
    initialConstraints: {
      productTypes: [{ id: "product-type-1", name: "Simple Product" }],
    },
  },
};
