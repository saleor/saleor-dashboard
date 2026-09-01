import { searchProducts } from "@dashboard/components/AssignProductDialog/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ModalProductFilterProvider } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignVariantDialogMulti } from "./AssignVariantDialogMulti";

const meta: Meta<typeof AssignVariantDialogMulti> = {
  title: "Components/AssignVariantDialogMulti",
  component: AssignVariantDialogMulti,
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
type Story = StoryObj<typeof AssignVariantDialogMulti>;

export const Default: Story = {};

/** Variants assigned before the dialog opened stay checked and locked. */
export const WithLockedSelection: Story = {
  args: { selectedIds: ["product-1-S", "product-2-M"] },
};

export const Loading: Story = {
  args: { products: [], loading: true },
};

export const Empty: Story = {
  args: { products: [] },
};
