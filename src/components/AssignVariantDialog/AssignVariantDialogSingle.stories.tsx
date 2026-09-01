import { searchProducts } from "@dashboard/components/AssignProductDialog/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ModalProductFilterProvider } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignVariantDialogSingle } from "./AssignVariantDialogSingle";

const meta: Meta<typeof AssignVariantDialogSingle> = {
  title: "Components/AssignVariantDialogSingle",
  component: AssignVariantDialogSingle,
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <ModalProductFilterProvider>
        <Story />
      </ModalProductFilterProvider>
    ),
  ],
  args: {
    open: true,
    confirmButtonState: "default",
    products: searchProducts,
    loading: false,
    hasMore: false,
    onClose: fn(),
    onFetchMore: fn(),
    onFilterChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignVariantDialogSingle>;

/** Product 3 has more variants than one page holds, so it grows a "Load more" row. */
export const Default: Story = {};

export const WithSelection: Story = {
  args: { selectedId: "product-1-M" },
};

export const Loading: Story = {
  args: { products: [], loading: true },
};

export const Empty: Story = {
  args: { products: [] },
};
