import type { Meta, StoryObj } from "@storybook/react-vite";

import { CreateProductDialog } from "./CreateProductDialog";

const meta: Meta<typeof CreateProductDialog> = {
  title: "Products / CreateProductDialog",
  component: CreateProductDialog,
};

export default meta;

type Story = StoryObj<typeof CreateProductDialog>;

export const Default: Story = {
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    productTypes: [
      { label: "Beer", value: "pt-beer", hasVariants: true },
      { label: "Mug", value: "pt-mug", hasVariants: false },
    ],
    fetchProductTypes: () => undefined,
    fetchMoreProductTypes: { loading: false, hasMore: false, onFetchMore: () => undefined },
    onClose: () => undefined,
    onCreateProductType: () => undefined,
    onSubmit: async () => [],
  },
};

export const EmptyShop: Story = {
  args: {
    ...Default.args,
    productTypes: [],
  },
};
