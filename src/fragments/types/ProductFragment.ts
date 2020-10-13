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

export interface ProductFragment_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductFragment_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductFragment_channelListing {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: ProductFragment_channelListing_discountedPrice | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: ProductFragment_channelListing_channel;
}

export interface ProductFragment {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductFragment_thumbnail | null;
  productType: ProductFragment_productType;
  channelListing: ProductFragment_channelListing[] | null;
}
