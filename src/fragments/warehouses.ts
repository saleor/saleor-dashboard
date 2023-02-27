import { gql } from "@apollo/client";

export const warehouseFragment = gql`
  fragment Warehouse on Warehouse {
    id
    name
  }
`;
export const warehouseWithShippingFragment = gql`
  fragment WarehouseWithShipping on Warehouse {
    ...Warehouse
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
  fragment WarehouseDetails on Warehouse {
    isPrivate
    clickAndCollectOption
    ...WarehouseWithShipping
    address {
      ...Address
    }
  }
`;
