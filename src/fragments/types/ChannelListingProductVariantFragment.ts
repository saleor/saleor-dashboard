/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelListingProductVariantFragment
// ====================================================

export interface ChannelListingProductVariantFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ChannelListingProductVariantFragment_price {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ChannelListingProductVariantFragment_costPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ChannelListingProductVariantFragment_preorderThreshold {
  __typename: "PreorderThreshold";
  quantity: number | null;
  soldUnits: number;
}

export interface ChannelListingProductVariantFragment {
  __typename: "ProductVariantChannelListing";
  channel: ChannelListingProductVariantFragment_channel;
  price: ChannelListingProductVariantFragment_price | null;
  costPrice: ChannelListingProductVariantFragment_costPrice | null;
  preorderThreshold: ChannelListingProductVariantFragment_preorderThreshold | null;
}
