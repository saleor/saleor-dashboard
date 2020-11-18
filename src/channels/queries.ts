import {
  channelDetailsFragment,
  channelFragment
} from "@saleor/fragments/channels";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { AppChannelList } from "./types/AppChannelList";
import { Channel, ChannelVariables } from "./types/Channel";
import { Channels } from "./types/Channels";

export const appChannelList = gql`
  ${channelFragment}
  query AppChannelList {
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

export const useAppChannelList = makeQuery<AppChannelList, {}>(appChannelList);
export const useChannelsList = makeQuery<Channels, {}>(channelsList);
export const useChannelDetails = makeQuery<Channel, ChannelVariables>(
  channelDetails
);
