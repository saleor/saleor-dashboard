import { gql } from "@apollo/client";

export const channelsListBase = gql`
  query BaseChannels {
    channels {
      ...ChannelFragment
    }
  }
`;

export const channelsList = gql`
  query Channels {
    channels {
      ...ChannelDetailsFragment
    }
  }
`;

export const channelDetails = gql`
  query Channel($id: ID!) {
    channel(id: $id) {
      ...ChannelDetailsFragment
    }
  }
`;
