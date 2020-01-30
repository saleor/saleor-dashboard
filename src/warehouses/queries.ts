import gql from "graphql-tag";

import makeQuery from "@saleor/hooks/makeQuery";
import { pageInfoFragment } from "@saleor/queries";
import { WarehouseList, WarehouseListVariables } from "./types/WarehouseList";

export const warehouseFragment = gql`
  fragment WarehouseFragment on Warehouse {
    id
    name
    shippingZones(first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const warehouseList = gql`
  ${warehouseFragment}
  ${pageInfoFragment}
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
          ...WarehouseFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useWarehouseList = makeQuery<
  WarehouseList,
  WarehouseListVariables
>(warehouseList);
