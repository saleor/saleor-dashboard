/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChannelListingAvailabilityFragment
// ====================================================

export interface ChannelListingAvailabilityFragment_channel {
  __typename: "Channel";
  id: string;
  name: string;
}

export interface ChannelListingAvailabilityFragment {
  __typename: "ProductChannelListing";
  isPublished: boolean;
  publicationDate: any | null;
  channel: ChannelListingAvailabilityFragment_channel;
}
