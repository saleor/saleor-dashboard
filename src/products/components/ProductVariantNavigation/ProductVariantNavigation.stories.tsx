import placeholderImage from "@assets/images/placeholder60x60.png";
import { variantSiblings } from "@dashboard/products/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ProductVariantNavigation } from "./ProductVariantNavigation";

const siblings = variantSiblings(placeholderImage);

const meta: Meta<typeof ProductVariantNavigation> = {
  title: "Products/ProductVariantNavigation",
  component: ProductVariantNavigation,
  args: {
    productId: "product-1",
    fallbackThumbnail: placeholderImage,
    defaultVariantId: siblings[0]?.id,
    current: siblings[0]?.id,
    currentVariant: siblings[0] ?? null,
    isCreate: false,
    onReorder: fn(),
  },
  parameters: {
    // Sibling list is loaded via ProductVariantSiblings query (Apollo).
    chromatic: { disableSnapshot: true },
  },
};

export default meta;
type Story = StoryObj<typeof ProductVariantNavigation>;

export const Default: Story = {};

export const CreateMode: Story = {
  args: {
    isCreate: true,
    current: undefined,
    currentVariant: null,
  },
};
