import gql from "graphql-tag";

export const channelErrorFragment = gql`
  fragment ChannelErrorFragment on ChannelError {
    code
    field
    message
  }
`;

export const channelFragment = gql`
  fragment ChannelFragment on Channel {
    id
    name
  }
`;
export const channelDetailsFragment = gql`
  ${channelFragment}
  fragment ChannelDetailsFragment on Channel {
    ...ChannelFragment
    isActive
    slug
    currencyCode
  }
`;
