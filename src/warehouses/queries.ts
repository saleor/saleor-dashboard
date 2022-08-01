import { gql } from "@apollo/client";

export const warehouseList = gql`
  query WarehouseList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: WarehouseFilterInput
    $sort: WarehouseSortingInput
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
          ...WarehouseWithShipping
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

// first: 100 - to be removed when we implement pagintion in ui for this query
export const channelWarehouses = gql`
  query ChannelWarehouses($filter: WarehouseFilterInput) {
    warehouses(filter: $filter, first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
    allWarehouses: warehouses {
      totalCount
    }
  }
`;
