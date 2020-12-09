import { fragmentMoney } from "@saleor/fragments/products";
import gql from "graphql-tag";

import { metadataFragment } from "./metadata";

export const shippingZoneFragment = gql`
  ${metadataFragment}
  fragment ShippingZoneFragment on ShippingZone {
    ...MetadataFragment
    id
    countries {
      code
      country
    }
    name
  }
`;

export const shippingMethodWithZipCodesFragment = gql`
  fragment ShippingMethodWithZipCodesFragment on ShippingMethod {
    id
    zipCodeRules {
      id
      start
      end
    }
  }
`;
export const shippingMethodFragment = gql`
  ${metadataFragment}
  ${fragmentMoney}
  ${shippingMethodWithZipCodesFragment}
  fragment ShippingMethodFragment on ShippingMethod {
    ...ShippingMethodWithZipCodesFragment
    ...MetadataFragment
    minimumOrderWeight {
      unit
      value
    }
    maximumOrderWeight {
      unit
      value
    }
    name
    type
    channelListings {
      id
      channel {
        id
        name
        currencyCode
      }
      price {
        ...Money
      }
      minimumOrderPrice {
        ...Money
      }
      maximumOrderPrice {
        ...Money
      }
    }
  }
`;
export const shippingMethodWithExcludedProductsFragment = gql`
  ${fragmentMoney}
  ${shippingMethodFragment}
  fragment ShippingMethodWithExcludedProductsFragment on ShippingMethod {
    ...ShippingMethodFragment
    excludedProducts(
      before: $before
      after: $after
      first: $first
      last: $last
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
        }
      }
    }
  }
`;

export const shippingZoneDetailsFragment = gql`
  ${shippingZoneFragment}
  ${shippingMethodFragment}
  fragment ShippingZoneDetailsFragment on ShippingZone {
    ...ShippingZoneFragment
    default
    shippingMethods {
      ...ShippingMethodFragment
    }
    warehouses {
      id
      name
    }
  }
`;
