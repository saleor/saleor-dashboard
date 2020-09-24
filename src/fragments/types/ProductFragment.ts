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

export interface ProductFragment_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ProductFragment_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ProductFragment_channelListing {
  __typename: "ProductChannelListing";
  channel: ProductFragment_channelListing_channel;
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: ProductFragment_channelListing_discountedPrice | null;
}

export interface ProductFragment {
  __typename: "Product";
  id: string;
  name: string;
  thumbnail: ProductFragment_thumbnail | null;
  isAvailable: boolean | null;
  productType: ProductFragment_productType;
  channelListing: ProductFragment_channelListing[] | null;
}
