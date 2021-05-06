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
    description
  }
`;

export const shippingMethodWithPostalCodesFragment = gql`
  fragment ShippingMethodWithPostalCodesFragment on ShippingMethod {
    id
    postalCodeRules {
      id
      inclusionType
      start
      end
    }
  }
`;
export const shippingMethodFragment = gql`
  ${metadataFragment}
  ${fragmentMoney}
  ${shippingMethodWithPostalCodesFragment}
  fragment ShippingMethodFragment on ShippingMethod {
    ...ShippingMethodWithPostalCodesFragment
    ...MetadataFragment
    minimumOrderWeight {
      unit
      value
    }
    maximumOrderWeight {
      unit
      value
    }
    minimumDeliveryDays
    maximumDeliveryDays
    name
    description
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
