import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import { shippingZoneFragment } from "@saleor/fragments/shipping";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";
import {
  SearchShippingZones,
  SearchShippingZonesVariables
} from "./types/SearchShippingZones";

const searchShippingZones = gql`
  ${pageInfoFragment}
  ${shippingZoneFragment}
  query SearchShippingZones(
    $query: String!
    $first: Int
    $after: String
    $last: Int
    $before: String
  ) {
    search: shippingZones(
      filter: { search: $query }
      first: $first
      after: $after
      last: $last
      before: $before
    ) {
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

export default makeTopLevelSearch<
  SearchShippingZones,
  SearchShippingZonesVariables
>(searchShippingZones);
