import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ModalProductFilterProvider } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import { AssignProductDialogSingle } from "./AssignProductDialogSingle";
import { searchProducts } from "./fixtures";

const meta: Meta<typeof AssignProductDialogSingle> = {
  title: "Components/AssignProductDialogSingle",
  component: AssignProductDialogSingle,
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
type Story = StoryObj<typeof AssignProductDialogSingle>;

export const Default: Story = {};

/** Opened on an existing assignment — that row starts selected. */
export const WithSelection: Story = {
  args: { selectedId: "product-2" },
};

export const Loading: Story = {
  args: { products: [], loading: true },
};

export const Empty: Story = {
  args: { products: [] },
};

/** Rows outside the voucher's channels render dimmed with an explanation. */
export const WithUnavailableProducts: Story = {
  args: {
    selectedChannels: [{ id: "channel-missing" }],
    productUnavailableText: "Not available in the selected channels",
  },
};
