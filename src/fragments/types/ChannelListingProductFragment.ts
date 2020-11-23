/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelListingProductFragment
// ====================================================

export interface ChannelListingProductFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ChannelListingProductFragment_pricing_priceRange_start_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ChannelListingProductFragment_pricing_priceRange_start {
  __typename: "TaxedMoney";
  net: ChannelListingProductFragment_pricing_priceRange_start_net;
}

export interface ChannelListingProductFragment_pricing_priceRange_stop_net {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ChannelListingProductFragment_pricing_priceRange_stop {
  __typename: "TaxedMoney";
  net: ChannelListingProductFragment_pricing_priceRange_stop_net;
}

export interface ChannelListingProductFragment_pricing_priceRange {
  __typename: "TaxedMoneyRange";
  start: ChannelListingProductFragment_pricing_priceRange_start | null;
  stop: ChannelListingProductFragment_pricing_priceRange_stop | null;
}

export interface ChannelListingProductFragment_pricing {
  __typename: "ProductPricingInfo";
  priceRange: ChannelListingProductFragment_pricing_priceRange | null;
}

export interface ChannelListingProductFragment {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: ChannelListingProductFragment_channel;
  pricing: ChannelListingProductFragment_pricing | null;
}
