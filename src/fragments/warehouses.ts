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
    clickAndCollectOption
    address {
      id
      city
      country {
        code
        country
      }
    }
    shippingZones(first: 100) {
      totalCount
      edges {
        node {
          id
          name
          channels {
            id
            name
          }
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
    email
    metadata {
      ...MetadataItem
    }
    privateMetadata {
      ...MetadataItem
    }
  }
`;
