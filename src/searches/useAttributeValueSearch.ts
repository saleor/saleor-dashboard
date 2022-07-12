import { gql } from "@apollo/client";
import {
  SearchAttributeValuesDocument,
  SearchAttributeValuesQuery,
  SearchAttributeValuesQueryVariables,
} from "@saleor/graphql";
import makeSearch from "@saleor/hooks/makeSearch";

export const searchAttributeValues = gql`
  query SearchAttributeValues(
    $id: ID
    $after: String
    $first: Int!
    $query: String!
  ) {
    attribute(id: $id) {
      id
      choices(after: $after, first: $first, filter: { search: $query }) {
        edges {
          node {
            ...AttributeValueDetails
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
  SearchAttributeValuesQuery,
  SearchAttributeValuesQueryVariables
>(SearchAttributeValuesDocument, result => {
  if (result.data?.attribute.choices.pageInfo.hasNextPage) {
    result.loadMore(
      (prev, next) => {
        if (
          prev.attribute.choices.pageInfo.endCursor ===
          next.attribute.choices.pageInfo.endCursor
        ) {
          return prev;
        }

        return {
          ...prev,
          attribute: {
            ...prev.attribute,
            choices: {
              ...prev.attribute.choices,
              edges: [
                ...prev.attribute.choices.edges,
                ...next.attribute.choices.edges,
              ],
              pageInfo: next.attribute.choices.pageInfo,
            },
          },
        };
      },
      {
        ...result.variables,
        after: result.data.attribute.choices.pageInfo.endCursor,
      },
    );
  }
});
