import { gql } from "@apollo/client";

export const warehouseList = gql`
  query WarehouseList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: WarehouseFilterInput
    $sort: WarehouseSortingInput
    $includeShippingZones: Boolean = false
  ) {
    warehouses(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...WarehouseListItem
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const warehouseDetails = gql`
  query WarehouseDetails($id: ID!) {
    warehouse(id: $id) {
      ...WarehouseDetails
    }
  }
`;

export const warehousesCount = gql`
  query WarehousesCount {
    warehouses {
      totalCount
    }
  }
`;

export const warehouseStockCount = gql`
  query WarehouseStockCount($id: ID!) {
    warehouse(id: $id) {
      id
      stocks(first: 1) {
        totalCount
      }
    }
  }
`;

export const warehouseChannelMembershipCounts = gql`
  query WarehouseChannelMembershipCounts {
    channels {
      id
      name
    }
    warehouses(first: 1) {
      totalCount
    }
  }
`;

export const warehouseChannelMembershipMatrix = gql`
  query WarehouseChannelMembershipMatrix {
    channels {
      id
      warehouses {
        id
      }
    }
  }
`;

export const warehousesInChannels = gql`
  query WarehousesInChannels($ids: [ID!]!, $channels: [ID!]!, $first: Int!) {
    warehouses(first: $first, filter: { ids: $ids, channels: $channels }) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

export const warehouseSharesChannels = gql`
  query WarehouseSharesChannels($warehouseId: ID!, $channelIds: [ID!]!) {
    warehouses(first: 1, filter: { ids: [$warehouseId], channels: $channelIds }) {
      totalCount
    }
  }
`;

export const warehouseShippingZonesToAssign = gql`
  query WarehouseShippingZonesToAssign(
    $filter: ShippingZoneFilterInput
    $first: Int!
    $after: String
  ) {
    shippingZones(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          name
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Pages through every zone linked to a warehouse; the details query stops at 100. */
export const warehouseShippingZonesPage = gql`
  query WarehouseShippingZonesPage($id: ID!, $first: Int!, $after: String) {
    warehouse(id: $id) {
      id
      shippingZones(first: $first, after: $after) {
        totalCount
        edges {
          node {
            id
            name
            channels {
              id
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const defaultGraphiQLQuery = `query WarehouseDetails($id: ID!) {
  warehouse(id: $id) {
    id
    name
    slug
  }
}`;
