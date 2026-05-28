import placeholderImage from "@assets/images/placeholder60x60.png";
import { product } from "@dashboard/products/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ProductVariantNavigation from "./ProductVariantNavigation";

const fixtureProduct = product(placeholderImage);

const meta: Meta<typeof ProductVariantNavigation> = {
  title: "Products/ProductVariantNavigation",
  component: ProductVariantNavigation,
  args: {
    productId: fixtureProduct?.id ?? "product-1",
    fallbackThumbnail: placeholderImage,
    variants: fixtureProduct?.variants,
    defaultVariantId: fixtureProduct?.defaultVariant?.id ?? undefined,
    current: fixtureProduct?.variants?.[0]?.id,
    isCreate: false,
    loading: false,
    onReorder: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductVariantNavigation>;

export const Default: Story = {};

export const CreateMode: Story = {
  args: {
    isCreate: true,
    variants: undefined,
  },
};

export const Loading: Story = {
  args: { loading: true, variants: undefined },
};

export const NoVariantsCreateMode: Story = {
  args: {
    isCreate: true,
    variants: [],
  },
};
