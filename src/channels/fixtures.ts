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
    isActive: true,
    name: "Test",
    slug: "test"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm7lbDoy213",
    isActive: true,
    name: "Channel",
    slug: "channel"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbn5lbDoytr",
    isActive: true,
    name: "Channel test",
    slug: "channeltest"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lbDo5bot",
    isActive: true,
    name: "Channel USD",
    slug: "channel-usd"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm7lbDoyr0tr",
    isActive: true,
    name: "Channel",
    slug: "channel2"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbn5lbDoyya",
    isActive: true,
    name: "Channel test",
    slug: "channeltest4"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lbDo5w0z",
    isActive: true,
    name: "Channel USD",
    slug: "channel-usd1"
  }
];

export const channel: Channel_channel = {
  __typename: "Channel",
  currencyCode: "zl",
  id: "Q2hhbm5lbDov78",
  isActive: true,
  name: "Test",
  slug: "test"
};

export const productChannels: ProductDetails_product_channelListing[] = [
  {
    __typename: "ProductChannelListing",
    channel: {
      __typename: "Channel",
      currencyCode: "USD",
      id: "123",
      name: "Channel1"
    },
    discountedPrice: {
      __typename: "Money",
      amount: 5,
      currency: "USD"
    },
    isPublished: true,
    publicationDate: "2020-07-14"
  },
  {
    __typename: "ProductChannelListing",
    channel: {
      __typename: "Channel",
      currencyCode: "USD",
      id: "124",
      name: "Channel2"
    },
    discountedPrice: {
      __typename: "Money",
      amount: 0,
      currency: "USD"
    },
    isPublished: false,
    publicationDate: "2020-07-30"
  },
  {
    __typename: "ProductChannelListing",
    channel: {
      __typename: "Channel",
      currencyCode: "USD",
      id: "125",
      name: "Channel3"
    },
    discountedPrice: {
      __typename: "Money",
      amount: 8,
      currency: "USD"
    },
    isPublished: false,
    publicationDate: null
  }
];

export const productPriceChannels = [
  {
    costPrice: "5",
    id: "123",
    name: "Channel1",
    sellingPrice: "10"
  },
  {
    costPrice: "15",
    id: "124",
    name: "Channel2",
    sellingPrice: "20"
  },
  {
    costPrice: "15",
    id: "125",
    name: "Channel3",
    sellingPrice: "100"
  }
];
