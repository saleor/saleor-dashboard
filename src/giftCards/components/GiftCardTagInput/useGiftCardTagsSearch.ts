import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeTopLevelSearch from "@saleor/hooks/makeTopLevelSearch";
import gql from "graphql-tag";

import {
  SearchGiftCardTags,
  SearchGiftCardTagsVariables
} from "./types/SearchGiftCardTags";

const searchGiftCardTags = gql`
  ${pageInfoFragment}
  query SearchGiftCardTags(
    $query: String!
    $first: Int!
    $after: String
    $last: Int
    $before: String
  ) {
    search: giftCardTags(
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
  SearchGiftCardTags,
  SearchGiftCardTagsVariables
>(searchGiftCardTags);
