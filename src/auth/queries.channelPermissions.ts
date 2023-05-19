import { gql } from "@apollo/client";

export const userDetailsWithChannelsQuery = gql`
  query UserDetailsWithChannels {
    me {
      ...UserWithChannels
    }
  }
`;
