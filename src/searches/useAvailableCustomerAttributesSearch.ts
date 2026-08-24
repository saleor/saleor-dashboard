// @ts-strict-ignore
import { gql } from "@apollo/client";
import {
  SearchAvailableCustomerAttributesDocument,
  type SearchAvailableCustomerAttributesQuery,
  type SearchAvailableCustomerAttributesQueryVariables,
} from "@dashboard/graphql";
import makeSearch from "@dashboard/hooks/makeSearch";

export const searchCustomerAttributes = gql`
  query SearchAvailableCustomerAttributes($id: ID!, $after: String, $first: Int!, $query: String!) {
    customerType(id: $id) {
      id
      availableAttributes(after: $after, first: $first, search: $query) {
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
  SearchAvailableCustomerAttributesQuery,
  SearchAvailableCustomerAttributesQueryVariables
>(SearchAvailableCustomerAttributesDocument, result =>
  result.loadMore(
    (prev, next) => {
      if (
        prev.customerType.availableAttributes.pageInfo.endCursor ===
        next.customerType.availableAttributes.pageInfo.endCursor
      ) {
        return prev;
      }

      return {
        ...prev,
        customerType: {
          ...prev.customerType,
          availableAttributes: {
            ...prev.customerType.availableAttributes,
            edges: [
              ...prev.customerType.availableAttributes.edges,
              ...next.customerType.availableAttributes.edges,
            ],
            pageInfo: next.customerType.availableAttributes.pageInfo,
          },
        },
      };
    },
    {
      after: result.data.customerType.availableAttributes.pageInfo.endCursor,
    },
  ),
);
