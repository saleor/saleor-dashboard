import { gql } from "@apollo/client";

export const channelOrderSettings = gql`
  query ChannelOrderSettings($id: ID!) {
    channel(id: $id) {
      ...ChannelOrderSettings
    }
  }
`;
