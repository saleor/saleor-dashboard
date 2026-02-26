// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchCategoriesDocument,
  type SearchCategoriesQuery,
  type SearchCategoriesQueryVariables,
  SearchCategoriesWithTotalProductsDocument,
  type SearchCategoriesWithTotalProductsQuery,
  type SearchCategoriesWithTotalProductsQueryVariables,
} from "@dashboard/graphql";
import makeTopLevelSearch from "@dashboard/hooks/makeTopLevelSearch";

export const searchCategories = gql`
  query SearchCategories($after: String, $first: Int!, $filter: CategoryFilterInput) {
    search: categories(after: $after, first: $first, filter: $filter) {
      edges {
        node {
          ...CategoryWithAncestors
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const searchCategoriesWithTotalProducts = gql`
  query SearchCategoriesWithTotalProducts(
    $after: String
    $first: Int!
    $filter: CategoryFilterInput
  ) {
    search: categories(after: $after, first: $first, filter: $filter) {
      edges {
        node {
          ...CategoryWithTotalProducts
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const useCategoryWithTotalProductsSearch = makeTopLevelSearch<
  SearchCategoriesWithTotalProductsQuery,
  SearchCategoriesWithTotalProductsQueryVariables
>(SearchCategoriesWithTotalProductsDocument, {
  mapSearchToVariables: (searchQuery, variables) => ({
    ...variables,
    filter: { ...variables.filter, search: searchQuery },
  }),
});

export default makeTopLevelSearch<SearchCategoriesQuery, SearchCategoriesQueryVariables>(
  SearchCategoriesDocument,
  {
    mapSearchToVariables: (searchQuery, variables) => ({
      ...variables,
      filter: { ...variables.filter, search: searchQuery },
    }),
  },
);
