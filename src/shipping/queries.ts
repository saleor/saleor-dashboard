import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  shippingMethodWithExcludedProductsFragment,
  shippingZoneFragment
} from "@saleor/fragments/shipping";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { ShippingZone, ShippingZoneVariables } from "./types/ShippingZone";
import {
  ShippingZoneChannels,
  ShippingZoneChannelsVariables
} from "./types/ShippingZoneChannels";
import { ShippingZones, ShippingZonesVariables } from "./types/ShippingZones";

const shippingZones = gql`
  ${pageInfoFragment}
  ${shippingZoneFragment}
  query ShippingZones(
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    shippingZones(first: $first, after: $after, last: $last, before: $before) {
      edges {
        node {
          ...ShippingZoneFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useShippingZoneList = makeQuery<
  ShippingZones,
  ShippingZonesVariables
>(shippingZones);

const shippingZone = gql`
  ${shippingZoneFragment}
  ${shippingMethodWithExcludedProductsFragment}
  query ShippingZone(
    $id: ID!
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    shippingZone(id: $id) {
      ...ShippingZoneFragment
      default
      shippingMethods {
        ...ShippingMethodWithExcludedProductsFragment
      }
      channels {
        id
        name
        currencyCode
      }
      warehouses {
        id
        name
      }
    }
  }
`;
export const useShippingZone = makeQuery<ShippingZone, ShippingZoneVariables>(
  shippingZone
);

const shippingZoneChannels = gql`
  query ShippingZoneChannels($id: ID!) {
    shippingZone(id: $id) {
      id
      channels {
        id
        name
        currencyCode
      }
    }
  }
`;

export const useShippingZoneChannels = makeQuery<
  ShippingZoneChannels,
  ShippingZoneChannelsVariables
>(shippingZoneChannels);
