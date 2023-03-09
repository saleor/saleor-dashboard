import { gql } from "@apollo/client";

export const channelOrderSettings = gql`
  fragment ChannelOrderSettings on Channel {
    orderSettings {
      markAsPaidStrategy
    }
  }
`;
