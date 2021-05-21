import { attributeValueFragment } from "@saleor/fragments/attributes";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeSearch from "@saleor/hooks/makeSearch";
import gql from "graphql-tag";

import {
  SearchAttributeValues,
  SearchAttributeValuesVariables
} from "./types/SearchAttributeValues";

export const searchAttributeValues = gql`
  ${pageInfoFragment}
  ${attributeValueFragment}
  query SearchAttributeValues(
    $id: ID
    $after: String
    $first: Int!
    $query: String!
  ) {
    attribute(id: $id) {
      id
      values(after: $after, first: $first, filter: { search: $query }) {
        edges {
          node {
            ...AttributeValueFragment
          }
        }
        pageInfo {
          ...PageInfoFragment
        }
      }
    }
  }
`;

export default makeSearch<
  SearchAttributeValues,
  SearchAttributeValuesVariables
>(searchAttributeValues, result => {
  if (result.data?.attribute.values.pageInfo.hasNextPage) {
    result.loadMore(
      (prev, next) => {
        if (
          prev.attribute.values.pageInfo.endCursor ===
          next.attribute.values.pageInfo.endCursor
        ) {
          return prev;
        }

        return {
          ...prev,
          attribute: {
            ...prev.attribute,
            values: {
              ...prev.attribute.values,
              edges: [
                ...prev.attribute.values.edges,
                ...next.attribute.values.edges
              ],
              pageInfo: next.attribute.values.pageInfo
            }
          }
        };
      },
      {
        ...result.variables,
        after: result.data.attribute.values.pageInfo.endCursor
      }
    );
  }
});
