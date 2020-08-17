import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
import { ProductDetails_product_channelListing } from "@saleor/products/types/ProductDetails";
import { ChannelErrorCode } from "@saleor/types/globalTypes";

import { Channel_channel } from "./types/Channel";
import { Channels_channels } from "./types/Channels";

export const channelCreateErrors: ChannelErrorFragment[] = [
  {
    __typename: "ChannelError",
    code: ChannelErrorCode.UNIQUE,
    field: "slug",
    message: "Channel with this Slug already exists."
  }
];

export const channelsList: Channels_channels[] = [
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lcDoy",
    name: "Test",
    slug: "test"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm7lbDoy",
    name: "Channel",
    slug: "channel"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbn5lbDoy",
    name: "Channel test",
    slug: "channeltest"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lbDo5",
    name: "Channel USD",
    slug: "channel-usd"
  }
];

export const channelsList1: Channels_channels[] = [
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm7lbDoy",
    name: "Channel",
    slug: "channel"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbn5lbDoy",
    name: "Channel test",
    slug: "channeltest"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lbDo5",
    name: "Channel USD",
    slug: "channel-usd"
  }
];

export const channel: Channel_channel = {
  __typename: "Channel",
  currencyCode: "zl",
  id: "Q2hhbm5lbDov",
  name: "Test",
  slug: "test"
};

export const productChannels: ProductDetails_product_channelListing[] = [
  {
    __typename: "ProductChannelListing",
    channel: {
      __typename: "Channel",
      id: "123",
      name: "Channel1"
    },
    isPublished: true,
    publicationDate: "2020-07-14"
  },
  {
    __typename: "ProductChannelListing",
    channel: {
      __typename: "Channel",
      id: "124",
      name: "Channel2"
    },
    isPublished: false,
    publicationDate: "2020-07-30"
  },
  {
    __typename: "ProductChannelListing",
    channel: {
      __typename: "Channel",
      id: "125",
      name: "Channel3"
    },
    isPublished: false,
    publicationDate: null
  }
];
