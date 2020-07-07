import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { Channel, ChannelVariables } from "./types/Channel";
import { Channels } from "./types/Channels";

export const channelDetailsFragment = gql`
  fragment ChannelDetailsFragment on Channel {
    id
    name
    slug
    currencyCode
  }
`;

export const channelsList = gql`
  ${channelDetailsFragment}
  query Channels {
    channels {
      ...ChannelDetailsFragment
    }
  }
`;

export const channelDetails = gql`
  ${channelDetailsFragment}
  query Channel($id: ID!) {
    channel(id: $id) {
      ...ChannelDetailsFragment
    }
  }
`;

export const useChannelsList = makeQuery<Channels, {}>(channelsList);
export const useChannelDetails = makeQuery<Channel, ChannelVariables>(
  channelDetails
);
