import gql from "graphql-tag";

export const channelErrorFragment = gql`
  fragment ChannelErrorFragment on ChannelError {
    code
    field
    message
  }
`;
