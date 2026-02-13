import { gql } from "@apollo/client";
import {
  SearchAvailableProductAttributesDocument,
  SearchAvailableProductAttributesQuery,
  SearchAvailableProductAttributesQueryVariables,
} from "@dashboard/graphql";
import makeSearch from "@dashboard/hooks/makeSearch";

export const searchProductAttributes = gql`
  query SearchAvailableProductAttributes($id: ID!, $after: String, $first: Int!, $query: String!) {
    productType(id: $id) {
      id
      availableAttributes(after: $after, first: $first, filter: { search: $query }) {
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
>(SearchAvailableProductAttributesDocument, result => {
  if (result.data?.productType?.availableAttributes?.pageInfo?.hasNextPage) {
    result.loadMore(
      (prev, next) => {
        if (
          prev.productType?.availableAttributes?.pageInfo?.endCursor ===
          next.productType?.availableAttributes?.pageInfo?.endCursor
        ) {
          return prev;
        }

        if (!next.productType || !next.productType.availableAttributes || !prev.productType) {
          return prev;
        }

        return {
          ...prev,
          productType: {
            ...prev.productType,
            availableAttributes: {
              ...(prev.productType.availableAttributes ?? next.productType.availableAttributes),
              edges: [
                ...(prev.productType.availableAttributes?.edges ?? []),
                ...(next.productType.availableAttributes.edges ?? []),
              ],
              pageInfo: next.productType.availableAttributes.pageInfo,
            },
          },
        };
      },
      {
        ...result.variables,
        after: result.data.productType.availableAttributes.pageInfo.endCursor,
      } as Partial<SearchAvailableProductAttributesQueryVariables>,
    );
  }
});
