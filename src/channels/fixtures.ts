import { ChannelErrorFragment } from "@saleor/fragments/types/ChannelErrorFragment";
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
  }
];

export const channel: Channel_channel = {
  __typename: "Channel",
  currencyCode: "zl",
  id: "Q2hhbm5lbDov",
  name: "Test",
  slug: "test"
};
