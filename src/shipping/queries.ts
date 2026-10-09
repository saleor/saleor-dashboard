import { gql } from "@apollo/client";

export const shippingZones = gql`
  query ShippingZones(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: ShippingZoneFilterInput
  ) {
    shippingZones(first: $first, after: $after, last: $last, before: $before, filter: $filter) {
      edges {
        node {
          ...ShippingZone
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const shippingZone = gql`
  query ShippingZone($id: ID!, $before: String, $after: String, $first: Int, $last: Int) {
    shippingZone(id: $id) {
      ...ShippingZone
      default
      shippingMethods {
        ...ShippingMethodWithExcludedProducts
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
      name
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

export const channelZoneWarehouseLinks = gql`
  query ChannelZoneWarehouseLinks($filter: ShippingZoneFilterInput) {
    shippingZones(filter: $filter, first: 100) {
      edges {
        node {
          id
          name
          channels {
            id
          }
          warehouses {
            id
            name
          }
        }
      }
    }
  }
`;

/** `checked` returns the ids this answer covers, so a stale answer can still be read while a new one loads. */
export const zoneWarehouseEligibility = gql`
  query ZoneWarehouseEligibility($ids: [ID!]!, $channels: [ID!]!, $first: Int!) {
    checked: warehouses(first: $first, filter: { ids: $ids }) {
      edges {
        node {
          id
        }
      }
    }
    inChannels: warehouses(first: $first, filter: { ids: $ids, channels: $channels }) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const shippingZonesCount = gql`
  query ShippingZonesCount {
    shippingZones {
      totalCount
    }
  }
`;

export const shippingMethodGraphiQLQuery = `query ShippingMethodDetails($id: ID!) {
  node(id: $id) {
    ... on ShippingMethodType {
      id
      name
      type
      minimumDeliveryDays
      maximumDeliveryDays
    }
  }
}`;
