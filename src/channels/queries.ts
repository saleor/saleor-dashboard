import { gql } from "@apollo/client";

export const channelsListBase = gql`
  query BaseChannels {
    channels {
      ...Channel
    }
  }
`;

export const channelsList = gql`
  query Channels {
    channels {
      ...ChannelDetails
    }
  }
`;

export const channelDetails = gql`
  query Channel($id: ID!) {
    channel(id: $id) {
      ...ChannelDetails
    }
  }
`;

export const channelOrderSettings = gql`
  query ChannelOrderSettings($id: ID!) {
    channel(id: $id) {
      ...ChannelOrderSettings
    }
  }
`;
