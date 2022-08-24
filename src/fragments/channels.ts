import { gql } from "@apollo/client";

export const channelErrorFragment = gql`
  fragment ChannelError on ChannelError {
    code
    field
    message
  }
`;

export const channelFragment = gql`
  fragment Channel on Channel {
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

export const channelDetailsFragment = gql`
  fragment ChannelDetails on Channel {
    ...Channel
    hasOrders
    warehouses {
      ...Warehouse
    }
  }
`;
