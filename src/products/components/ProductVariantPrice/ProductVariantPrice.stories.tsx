import { type ChannelData } from "@dashboard/channels/utils";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ProductVariantPrice } from "./ProductVariantPrice";

const listings: ChannelData[] = [
  {
    id: "channel-usd",
    name: "Channel-USD",
    currency: "USD",
    price: "10",
    costPrice: "4",
    isActive: true,
    isPublished: true,
    isAvailableForPurchase: true,
  },
  {
    id: "channel-eur",
    name: "Channel-EUR",
    currency: "EUR",
    price: "9",
    costPrice: "3",
    isActive: true,
    isPublished: true,
    isAvailableForPurchase: false,
  },
  {
    id: "channel-pln",
    name: "Channel-PLN",
    currency: "PLN",
    price: "40",
    costPrice: "",
    isActive: false,
    isPublished: true,
    isAvailableForPurchase: true,
  },
];

const meta: Meta<typeof ProductVariantPrice> = {
  title: "Products/ProductVariantPrice",
  component: ProductVariantPrice,
  args: {
    errors: [],
    productVariantChannelListings: listings,
    availableChannelsCount: 4,
    onChange: fn(),
    onChannelsReplace: fn(),
    onManageClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProductVariantPrice>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    productVariantChannelListings: [],
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
