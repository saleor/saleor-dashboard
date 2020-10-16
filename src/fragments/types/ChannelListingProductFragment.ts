/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelListingProductFragment
// ====================================================

export interface ChannelListingProductFragment_discountedPrice {
  __typename: "Money";
  amount: number;
  currency: string;
}

export interface ChannelListingProductFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
  currencyCode: string;
}

export interface ChannelListingProductFragment {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  discountedPrice: ChannelListingProductFragment_discountedPrice | null;
  isAvailableForPurchase: boolean | null;
  availableForPurchase: any | null;
  visibleInListings: boolean;
  channel: ChannelListingProductFragment_channel;
}
