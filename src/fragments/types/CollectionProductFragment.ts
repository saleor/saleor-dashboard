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

export interface CollectionProductFragment_channelListings_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface CollectionProductFragment_channelListings {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: CollectionProductFragment_channelListings_channel;
}

export interface CollectionProductFragment {
  __typename: "Product";
  id: string;
  name: string;
  productType: CollectionProductFragment_productType;
  thumbnail: CollectionProductFragment_thumbnail | null;
  channelListings: CollectionProductFragment_channelListings[] | null;
}
