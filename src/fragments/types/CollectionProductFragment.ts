/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionProductFragment
// ====================================================

export interface CollectionProductFragment_productType {
  __typename: "ProductType";
  id: string;
  name: string;
}

export interface CollectionProductFragment_thumbnail {
  __typename: "Image";
  url: string;
}

export interface CollectionProductFragment_channelListing_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface CollectionProductFragment_channelListing_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CollectionProductFragment_channelListing {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: CollectionProductFragment_channelListing_discountedPrice | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: CollectionProductFragment_channelListing_channel;
}

export interface CollectionProductFragment {
  __typename: "Product";
  id: string;
  name: string;
  productType: CollectionProductFragment_productType;
  thumbnail: CollectionProductFragment_thumbnail | null;
  channelListing: CollectionProductFragment_channelListing[] | null;
}
