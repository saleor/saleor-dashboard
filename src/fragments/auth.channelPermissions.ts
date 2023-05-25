import { gql } from "@apollo/client";

export const channelFragment = gql`
  fragment ChannelFragment on Channel {
    id
    isActive
    name
    slug
    currencyCode
    defaultCountry {
      code
      country
    }
    stockSettings {
      allocationStrategy
    }
  }
`;

export const fragmentUserWithChannels = gql`
  fragment UserWithChannels on User {
    id
    email
    firstName
    lastName
    isStaff
    userPermissions {
      ...UserPermission
    }
    avatar(size: 128) {
      url
    }
    accessibleChannels {
      ...ChannelFragment
    }
    restrictedAccessToChannels
  }
`;
