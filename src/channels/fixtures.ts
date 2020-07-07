import { ChannelErrorCode } from "@saleor/types/globalTypes";

import { ChannelErrorFragment } from "./types/ChannelErrorFragment";
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
    id: "Q2hhbm5lbDoy",
    name: "Test",
    slug: "test"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lbDoy",
    name: "Channel",
    slug: "channel"
  },
  {
    __typename: "Channel",
    currencyCode: "euro",
    id: "Q2hhbm5lbDoy",
    name: "Channel test",
    slug: "channeltest"
  }
];
