import makeQuery from "@saleor/hooks/makeQuery";
import { fragmentAddress } from "@saleor/orders/queries";
import { pageInfoFragment } from "@saleor/queries";
import gql from "graphql-tag";

import {
  WarehouseDetails,
  WarehouseDetailsVariables
} from "./types/WarehouseDetails";
import { WarehouseList, WarehouseListVariables } from "./types/WarehouseList";

export const warehouseFragment = gql`
  fragment WarehouseFragment on Warehouse {
    id
    name
  }
`;
export const warehouseWithShippingFragment = gql`
  ${warehouseFragment}
  fragment WarehouseWithShippingFragment on Warehouse {
    ...WarehouseFragment
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

export const warehouseDetailsFragment = gql`
  ${fragmentAddress}
  ${warehouseWithShippingFragment}
  fragment WarehouseDetailsFragment on Warehouse {
    ...WarehouseWithShippingFragment
    address {
      ...AddressFragment
    }
  }
`;

const warehouseList = gql`
  ${warehouseWithShippingFragment}
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
          ...WarehouseWithShippingFragment
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

const warehouseDetails = gql`
  ${warehouseDetailsFragment}
  query WarehouseDetails($id: ID!) {
    warehouse(id: $id) {
      ...WarehouseDetailsFragment
    }
  }
`;
export const useWarehouseDetails = makeQuery<
  WarehouseDetails,
  WarehouseDetailsVariables
>(warehouseDetails);
