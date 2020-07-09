import gql from "graphql-tag";

export const channelErrorFragment = gql`
  fragment ChannelErrorFragment on ChannelError {
    code
    field
    message
  }
`;

export const channelDetailsFragment = gql`
  fragment ChannelDetailsFragment on Channel {
    id
    name
    slug
    currencyCode
  }
`;
