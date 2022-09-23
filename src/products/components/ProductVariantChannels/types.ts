import {
  ProductVariantCreateDataQuery,
  ProductVariantFragment,
} from "@saleor/graphql";

export type Product = ProductVariantCreateDataQuery["product"];
export type Variant = ProductVariantFragment;
export type ProductChannelListing = Product["channelListings"];
export type VariantChannelListing = Variant["channelListings"];
export type ChannelListings = ProductChannelListing | VariantChannelListing;
export type Channel = ProductChannelListing[number]["channel"];
