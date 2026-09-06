import { listActionsProps } from "@dashboard/fixtures";
import { productType } from "@dashboard/productTypes/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ProductTypeVariantAttributes from "./ProductTypeVariantAttributes";

const assignedVariantAttributes = productType?.assignedVariantAttributes ?? [];

const meta: Meta<typeof ProductTypeVariantAttributes> = {
  title: "Product types/ProductTypeVariantAttributes",
  component: ProductTypeVariantAttributes,
  args: {
    ...listActionsProps,
    assignedVariantAttributes,
    disabled: false,
    hasVariants: true,
    type: "VARIANT",
    selectedVariantAttributes: [],
    onAttributeAssign: fn(),
    onAttributeCreate: fn(),
    onAttributeReorder: fn(),
    onAttributeUnassign: fn(),
    onHasVariantsToggle: fn(),
    setSelectedVariantAttributes: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductTypeVariantAttributes>;

export const Default: Story = {};

/** Attributes marked as variant selection get the extra checkbox column checked. */
export const WithVariantSelection: Story = {
  args: {
    selectedVariantAttributes: [assignedVariantAttributes[0].attribute.id],
  },
};

export const WithSelection: Story = {
  args: { selected: 1, isChecked: () => true },
};

export const Loading: Story = {
  args: { assignedVariantAttributes: undefined, loading: true, disabled: true },
};

export const Empty: Story = {
  args: { assignedVariantAttributes: [] },
};

/** Product type without variants — the table is replaced by the toggle only. */
export const WithoutVariants: Story = {
  args: { hasVariants: false },
};
