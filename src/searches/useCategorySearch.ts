// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchCategoriesDocument,
  SearchCategoriesQuery,
  SearchCategoriesQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchCategories = gql`
  query SearchCategories($after: String, $first: Int!, $query: String!) {
    search: categories(after: $after, first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          ancestors(first: 1) {
            edges {
              node {
                id
                name
              }
            }
          }
          parent {
            name
            id
          }
          level
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export default makeTopLevelSearch<SearchCategoriesQuery, SearchCategoriesQueryVariables>(
  SearchCategoriesDocument,
);
