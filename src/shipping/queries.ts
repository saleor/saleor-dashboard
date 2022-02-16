import { gql } from "@apollo/client";

export const shippingZones = gql`
  query ShippingZones(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    shippingZones(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          ...ShippingZoneFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const shippingZone = gql`
  query ShippingZone(
    $id: ID!
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    shippingZone(id: $id) {
      ...ShippingZoneFragment
      shippingMethods {
        ...ShippingMethodWithExcludedProductsFragment
      }
      channels {
        id
        name
        currencyCode
      }
      warehouses {
        id
        name
      }
    }
  }
`;
export const shippingZoneChannels = gql`
  query ShippingZoneChannels($id: ID!) {
    shippingZone(id: $id) {
      id
      channels {
        id
        name
        currencyCode
      }
    }
  }
`;

// first: 100 - to be removed when we implement pagintion in ui for this query
export const channelShippingZones = gql`
  query ChannelShippingZones($filter: ShippingZoneFilterInput) {
    shippingZones(filter: $filter, first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
