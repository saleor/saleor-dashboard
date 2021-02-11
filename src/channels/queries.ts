import {
  channelDetailsFragment,
  channelFragment
} from "@saleor/fragments/channels";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { BaseChannels } from "./types/BaseChannels";
import { Channel, ChannelVariables } from "./types/Channel";
import { Channels } from "./types/Channels";

export const channelsListBase = gql`
  ${channelFragment}
  query BaseChannels {
    channels {
      ...ChannelFragment
    }
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

export const useBaseChannelsList = makeQuery<BaseChannels, {}>(
  channelsListBase
);
export const useChannelsList = makeQuery<Channels, {}>(channelsList);
export const useChannelDetails = makeQuery<Channel, ChannelVariables>(
  channelDetails
);
