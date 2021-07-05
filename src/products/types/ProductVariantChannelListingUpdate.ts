/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductVariantChannelListingAddInput, ProductErrorCode } from "./../../types/globalTypes";

// ====================================================
// GraphQL mutation operation: ProductVariantChannelListingUpdate
// ====================================================

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings {
  __typename: "ProductVariantChannelListing";
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_channel;
  price: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_price | null;
  costPrice: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings_costPrice | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start_net;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop_net;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_start | null;
  stop: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange_stop | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing_priceRange | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_channel;
  pricing: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings_pricing | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product {
  __typename: "Product";
  id: string;
  channelListings: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product_channelListings[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant {
  __typename: "ProductVariant";
  id: string;
  channelListings: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_channelListings[] | null;
  product: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant_product;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_errors {
  __typename: "ProductChannelListingError";
  code: ProductErrorCode;
  field: string | null;
  message: string | null;
  channels: string[] | null;
}

export interface ProductVariantChannelListingUpdate_productVariantChannelListingUpdate {
  __typename: "ProductVariantChannelListingUpdate";
  variant: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_variant | null;
  errors: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_errors[];
}

export interface ProductVariantChannelListingUpdate {
  productVariantChannelListingUpdate: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate | null;
}

export interface ProductVariantChannelListingUpdateVariables {
  id: string;
  input: ProductVariantChannelListingAddInput[];
}
