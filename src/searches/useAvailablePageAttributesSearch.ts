import { gql } from "@apollo/client";
import {
  SearchAvailablePageAttributesDocument,
  SearchAvailablePageAttributesQuery,
  SearchAvailablePageAttributesQueryVariables,
} from "@saleor/graphql";
import makeSearch from "@saleor/hooks/makeSearch";

export const searchPageAttributes = gql`
  query SearchAvailablePageAttributes(
    $id: ID!
    $after: String
    $first: Int!
    $query: String!
  ) {
    pageType(id: $id) {
      id
      availableAttributes(
        after: $after
        first: $first
        filter: { search: $query }
      ) {
        edges {
          node {
            ...AvailableAttribute
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
`;

export default makeSearch<
  SearchAvailablePageAttributesQuery,
  SearchAvailablePageAttributesQueryVariables
>(SearchAvailablePageAttributesDocument, result =>
  result.loadMore(
    (prev, next) => {
      if (
        prev.pageType.availableAttributes.pageInfo.endCursor ===
        next.pageType.availableAttributes.pageInfo.endCursor
      ) {
        return prev;
      }

      return {
        ...prev,
        pageType: {
          ...prev.pageType,
          availableAttributes: {
            ...prev.pageType.availableAttributes,
            edges: [
              ...prev.pageType.availableAttributes.edges,
              ...next.pageType.availableAttributes.edges,
            ],
            pageInfo: next.pageType.availableAttributes.pageInfo,
          },
        },
      };
    },
    {
      after: result.data.pageType.availableAttributes.pageInfo.endCursor,
    },
  ),
);
