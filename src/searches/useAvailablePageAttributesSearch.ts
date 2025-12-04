import { gql } from "@apollo/client";
import {
  SearchAvailablePageAttributesDocument,
  SearchAvailablePageAttributesQuery,
  SearchAvailablePageAttributesQueryVariables,
} from "@dashboard/graphql";
import makeSearch from "@dashboard/hooks/makeSearch";

export const searchPageAttributes = gql`
  query SearchAvailablePageAttributes($id: ID!, $after: String, $first: Int!, $query: String!) {
    pageType(id: $id) {
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
  SearchAvailablePageAttributesQuery,
  SearchAvailablePageAttributesQueryVariables
>(SearchAvailablePageAttributesDocument, result => {
  if (result.data?.pageType?.availableAttributes?.pageInfo?.hasNextPage) {
    result.loadMore(
      (prev, next) => {
        if (
          prev.pageType?.availableAttributes?.pageInfo?.endCursor ===
          next.pageType?.availableAttributes?.pageInfo?.endCursor
        ) {
          return prev;
        }

        if (!next.pageType || !next.pageType.availableAttributes || !prev.pageType) {
          return prev;
        }

        return {
          ...prev,
          pageType: {
            ...prev.pageType,
            availableAttributes: {
              ...(prev.pageType.availableAttributes ?? next.pageType.availableAttributes),
              edges: [
                ...(prev.pageType.availableAttributes?.edges ?? []),
                ...(next.pageType.availableAttributes.edges ?? []),
              ],
              pageInfo: next.pageType.availableAttributes.pageInfo,
            },
          },
        };
      },
      {
        ...result.variables,
        after: result.data.pageType.availableAttributes.pageInfo.endCursor,
      } as Partial<SearchAvailablePageAttributesQueryVariables>,
    );
  }
});
