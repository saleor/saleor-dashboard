import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { AssignProductPickerList } from "./AssignProductPickerList";
import { searchProducts } from "./fixtures";
import { type Products } from "./types";
import { type AssignProductPicker } from "./useAssignProductPicker";

const basePicker: AssignProductPicker = {
  confirmButtonState: "default",
  displayedProducts: searchProducts,
  handleChange: fn(),
  handleClose: fn(),
  handleSubmit: fn(),
  handleToggleSelectAllVisible: fn(),
  hasMore: false,
  hasSelectionChanged: true,
  isProductAvailable: () => true,
  loading: false,
  onFetchMore: fn(),
  onQueryChange: fn(),
  productUnavailableText: undefined,
  productsDict: { "product-2": true },
  query: "",
  resumeBackfill: fn(),
  selectAllCheckboxState: { checked: false, indeterminate: true },
  selectedCount: 1,
  showBackfillExhausted: false,
  showEmptyState: false,
  showListLoading: false,
  showSelectAll: false,
  showSelectAllScrollHint: false,
};

const meta: Meta<typeof AssignProductPickerList> = {
  title: "Components/AssignProductPickerList",
  component: AssignProductPickerList,
  args: {
    picker: basePicker,
    scrollableTargetId: "assign-product-picker-list-story",
  },
  decorators: [
    (Story: ComponentType): JSX.Element => (
      <div id="assign-product-picker-list-story" style={{ height: 400, overflow: "auto" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AssignProductPickerList>;

export const Default: Story = {};

/** The "select all visible" bar only shows once the list is scoped by search or filters. */
export const WithSelectAll: Story = {
  args: { picker: { ...basePicker, showSelectAll: true, query: "hoodie" } },
};

export const Loading: Story = {
  args: {
    picker: { ...basePicker, displayedProducts: [], loading: true, showListLoading: true },
  },
};

export const Empty: Story = {
  args: { picker: { ...basePicker, displayedProducts: [], showEmptyState: true } },
};

/** Exclusion emptied every loaded page — the picker offers to pull the next one. */
export const BackfillExhausted: Story = {
  args: { picker: { ...basePicker, displayedProducts: [], showBackfillExhausted: true } },
};

/** Rows the caller cannot assign render dimmed with an explanation. */
export const WithUnavailableProducts: Story = {
  args: {
    picker: {
      ...basePicker,
      isProductAvailable: (product: Products[number]) => product.id !== "product-3",
      productUnavailableText: "Not available in the selected channels",
    },
  },
};
