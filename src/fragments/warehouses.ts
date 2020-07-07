import gql from "graphql-tag";

import { fragmentAddress } from "./address";

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
