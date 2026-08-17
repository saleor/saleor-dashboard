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
import { mapFilterSearchQuery } from "@dashboard/hooks/makeTopLevelSearch/mapFilterSearchQuery";

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
  mapSearchToVariables: mapFilterSearchQuery,
});

export default makeTopLevelSearch<SearchCategoriesQuery, SearchCategoriesQueryVariables>(
  SearchCategoriesDocument,
  {
    mapSearchToVariables: mapFilterSearchQuery,
  },
);
