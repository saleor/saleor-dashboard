import { fragmentMoney } from "@saleor/fragments/products";
import gql from "graphql-tag";

export const shippingZoneFragment = gql`
  fragment ShippingZoneFragment on ShippingZone {
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
  ${fragmentMoney}
  ${shippingMethodWithZipCodesFragment}
  fragment ShippingMethodFragment on ShippingMethod {
    ...ShippingMethodWithZipCodesFragment
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
