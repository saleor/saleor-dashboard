import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchShippingZones,
  SearchShippingZonesVariables
} from "./types/SearchShippingZones";

const searchShippingZones = gql`
  ${pageInfoFragment}
  query SearchShippingZones(
    $query: String!
    $first: Int!
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
      totalCount
      edges {
        node {
          id
          name
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
