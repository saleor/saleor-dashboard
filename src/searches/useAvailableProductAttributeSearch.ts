import { gql } from "@apollo/client";
import {
  SearchAvailableProductAttributesDocument,
  SearchAvailableProductAttributesQuery,
  SearchAvailableProductAttributesQueryVariables,
} from "@saleor/graphql";
import makeSearch from "@saleor/hooks/makeSearch";

export const searchProductAttributes = gql`
  query SearchAvailableProductAttributes(
    $id: ID!
    $after: String
    $first: Int!
    $query: String!
  ) {
    productType(id: $id) {
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
  SearchAvailableProductAttributesQuery,
  SearchAvailableProductAttributesQueryVariables
>(SearchAvailableProductAttributesDocument, result =>
  result.loadMore(
    (prev, next) => {
      if (
        prev.productType.availableAttributes.pageInfo.endCursor ===
        next.productType.availableAttributes.pageInfo.endCursor
      ) {
        return prev;
      }

      return {
        ...prev,
        productType: {
          ...prev.productType,
          availableAttributes: {
            ...prev.productType.availableAttributes,
            edges: [
              ...prev.productType.availableAttributes.edges,
              ...next.productType.availableAttributes.edges,
            ],
            pageInfo: next.productType.availableAttributes.pageInfo,
          },
        },
      };
    },
    {
      after: result.data.productType.availableAttributes.pageInfo.endCursor,
    },
  ),
);
