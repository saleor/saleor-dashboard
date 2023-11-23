import { gql } from "@apollo/client";
import {
  SearchVariantsDocument,
  SearchVariantsQuery,
  SearchVariantsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchVariants = gql`
  query SearchVariants($after: String, $first: Int!, $query: String!) {
    search: productVariants(
      after: $after
      first: $first
      filter: { search: $query }
    ) {
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

export default makeTopLevelSearch<
  SearchVariantsQuery,
  SearchVariantsQueryVariables
>(SearchVariantsDocument);
