// @ts-strict-ignore
import {
  type ProductVariantCreateDataQuery,
  type ProductVariantFragment,
} from "@dashboard/graphql";

export type Product = ProductVariantCreateDataQuery["product"];
export type Variant = ProductVariantFragment;
export type ProductChannelListing = Product["channelListings"];
export type VariantChannelListing = Variant["channelListings"];
