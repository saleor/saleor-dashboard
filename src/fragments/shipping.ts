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
export const shippingMethodFragment = gql`
  ${fragmentMoney}
  fragment ShippingMethodFragment on ShippingMethod {
    id
    minimumOrderPrice {
      amount
      currency
    }
    minimumOrderWeight {
      unit
      value
    }
    maximumOrderPrice {
      amount
      currency
    }
    maximumOrderWeight {
      unit
      value
    }
    name
    price {
      amount
      currency
    }
    type
    channelListing {
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
