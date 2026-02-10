import type { Meta, StoryObj } from "@storybook/react-vite";

import { AssignProductDialog } from "./AssignProductDialog";
import { Products } from "./types";

const mockProducts: Products = Array.from({ length: 6 }, (_, i) => ({
  __typename: "Product" as const,
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
  productType: {
    __typename: "ProductType" as const,
    id: `product-type-${i + 1}`,
    name: `Product Type ${i + 1}`,
  },
  thumbnail: {
    __typename: "Image" as const,
    url: `https://placehold.co/64x64?text=P${i + 1}`,
  },
  channelListings: [
    {
      __typename: "ProductChannelListing" as const,
      id: `listing-${i + 1}`,
      isPublished: true,
      publishedAt: "2024-01-01",
      isAvailableForPurchase: true,
      availableForPurchaseAt: "2024-01-01",
      visibleInListings: true,
      channel: {
        __typename: "Channel" as const,
        id: "channel-1",
        name: "Default Channel",
        slug: "default-channel",
        currencyCode: "USD",
      },
    },
  ],
  variants: [
    {
      __typename: "ProductVariant" as const,
      id: `variant-${i + 1}-1`,
      name: `Variant ${i + 1}-1`,
      sku: `SKU-${i + 1}-1`,
      product: {
        __typename: "Product" as const,
        id: `product-${i + 1}`,
        name: `Product ${i + 1}`,
        thumbnail: null,
        productType: {
          __typename: "ProductType" as const,
          id: `product-type-${i + 1}`,
          name: `Product Type ${i + 1}`,
        },
      },
      channelListings: [
        {
          __typename: "ProductVariantChannelListing" as const,
          channel: {
            __typename: "Channel" as const,
            id: "channel-1",
            isActive: true,
            name: "Default Channel",
            currencyCode: "USD",
          },
          price: {
            __typename: "Money" as const,
            amount: 10 + i,
            currency: "USD",
          },
        },
      ],
    },
  ],
  collections: [],
}));

const noop = () => {};

const meta: Meta<typeof AssignProductDialog> = {
  title: "Components/AssignProductDialog",
  component: AssignProductDialog,
  args: {
    open: true,
    products: mockProducts,
    loading: false,
    hasMore: false,
    confirmButtonState: "default",
    onClose: noop,
    onFetchMore: noop,
    onSubmit: noop,
    onFilterChange: noop,
  },
};

export default meta;
type Story = StoryObj<typeof AssignProductDialog>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: {
    selectionMode: "single",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    products: [],
  },
};

export const Empty: Story = {
  args: {
    products: [],
  },
};

export const WithUnavailableProducts: Story = {
  args: {
    selectedChannels: [{ id: "channel-unavailable" }],
    productUnavailableText: "Not available in selected channels",
  },
};
