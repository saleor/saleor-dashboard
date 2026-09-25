import { orderLineSearch } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderProductAddDialog } from "./OrderProductAddDialog";

const placeholderImage = "https://via.placeholder.com/64";
const products = orderLineSearch(placeholderImage);

const meta: Meta<typeof OrderProductAddDialog> = {
  title: "Orders/OrderProductAddDialog",
  component: OrderProductAddDialog,
  args: {
    open: true,
    confirmButtonState: "default",
    errors: [],
    products,
    hasMore: false,
    loading: false,
    channelName: "Default Channel",
    channel: "default-channel",
    onClose: fn(),
    onFetch: fn(),
    onFetchMore: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderProductAddDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: { products: [], loading: true },
};

export const Empty: Story = {
  args: { products: [] },
};

/** Backend has more pages — scrolling triggers the next fetch. */
export const HasMore: Story = {
  args: { hasMore: true },
};

/** Channel-listed variants sit past the embedded page, so the product stays visible with nothing priced yet. */
export const ChannelVariantsBeyondFirstPage: Story = {
  args: {
    products: [
      {
        ...products[0],
        name: "Wool Scarf",
        variants: [],
        variantsHasNextPage: true,
        variantsTotalCount: 100,
        channelVariantIds: Array.from({ length: 50 }, (_, index) => `variant-${index + 51}`),
        missingVariantIds: Array.from({ length: 50 }, (_, index) => `variant-${index + 51}`),
      },
    ],
  },
};
