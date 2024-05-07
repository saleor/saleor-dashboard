// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchGiftCardTagsDocument,
  SearchGiftCardTagsQuery,
  SearchGiftCardTagsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchGiftCardTags = gql`
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
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<SearchGiftCardTagsQuery, SearchGiftCardTagsQueryVariables>(
  SearchGiftCardTagsDocument,
);
