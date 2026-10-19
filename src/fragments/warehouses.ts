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

/** List rows only need zone channel ids, and only when zones decide stock availability. */
export const warehouseListItemFragment = gql`
  fragment WarehouseListItem on Warehouse {
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
    shippingZones(first: 100) @include(if: $includeShippingZones) {
      totalCount
      edges {
        node {
          id
          channels {
            id
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
