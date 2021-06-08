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
      choices(after: $after, first: $first, filter: { search: $query }) {
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
                ...next.attribute.choices.edges
              ],
              pageInfo: next.attribute.choices.pageInfo
            }
          }
        };
      },
      {
        ...result.variables,
        after: result.data.attribute.choices.pageInfo.endCursor
      }
    );
  }
});
