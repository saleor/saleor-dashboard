import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  shippingMethodWithExcludedProductsFragment,
  shippingZoneFragment
} from "@saleor/fragments/shipping";
import makeQuery from "@saleor/hooks/makeQuery";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchShippingProducts,
  SearchShippingProductsVariables
} from "./types/SearchShippingProducts";
import { ShippingZone, ShippingZoneVariables } from "./types/ShippingZone";
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

export const searchProducts = gql`
  query SearchShippingProducts($first: Int!, $query: String!, $after: String) {
    search: products(first: $first, after: $after, filter: { search: $query }) {
      edges {
        node {
          id
          name
          thumbnail {
            url
          }
          channelListings {
            channel {
              id
            }
            pricing {
              priceRange {
                start {
                  net {
                    amount
                    currency
                  }
                }
                stop {
                  net {
                    amount
                    currency
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;
export const useProductsSearch = makeTopLevelSearch<
  SearchShippingProducts,
  SearchShippingProductsVariables
>(searchProducts);
