import { gql } from "@apollo/client";

export const shippingZoneFragment = gql`
  fragment ShippingZone on ShippingZone {
    ...Metadata
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
  fragment ShippingMethodWithPostalCodes on ShippingMethodType {
    id
    postalCodeRules {
      id
      inclusionType
      start
      end
    }
  }
`;
export const shippingMethodTypeFragment = gql`
  fragment ShippingMethodType on ShippingMethodType {
    ...ShippingMethodWithPostalCodes
    ...Metadata
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
  fragment ShippingMethodWithExcludedProducts on ShippingMethodType {
    ...ShippingMethodType
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
  fragment ShippingZoneDetails on ShippingZone {
    ...ShippingZone
    shippingMethods {
      ...ShippingMethodType
    }
    warehouses {
      id
      name
    }
  }
`;
