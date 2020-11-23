/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProductFragment
// ====================================================

export interface ProductFragment_thumbnail {
  __typename: "Image";
  url: string;
}

export interface ProductFragment_productType {
  __typename: "ProductType";
  id: string;
  name: string;
  hasVariants: boolean;
}

export interface ProductFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductFragment_channelListings_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductFragment_channelListings_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ProductFragment_channelListings_pricing_priceRange_start_net;
}

export interface ProductFragment_channelListings_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductFragment_channelListings_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ProductFragment_channelListings_pricing_priceRange_stop_net;
}

export interface ProductFragment_channelListings_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ProductFragment_channelListings_pricing_priceRange_start | null;
  stop: ProductFragment_channelListings_pricing_priceRange_stop | null;
}

export interface ProductFragment_channelListings_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ProductFragment_channelListings_pricing_priceRange | null;
}

export interface ProductFragment_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: ProductFragment_channelListings_channel;
  pricing: ProductFragment_channelListings_pricing | null;
}

export interface ProductFragment {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductFragment_thumbnail | null;
  productType: ProductFragment_productType;
  channelListings: ProductFragment_channelListings[] | null;
}
