import { availableAttributeFragment } from "@saleor/fragments/attributes";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeSearch from "@saleor/hooks/makeSearch";
import gql from "graphql-tag";

import {
  SearchAvailablePageAttributes,
  SearchAvailablePageAttributesVariables
} from "./types/SearchAvailablePageAttributes";

export const searchPageAttributes = gql`
  ${pageInfoFragment}
  ${availableAttributeFragment}
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
            ...AvailableAttributeFragment
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
  SearchAvailablePageAttributes,
  SearchAvailablePageAttributesVariables
>(searchPageAttributes, result =>
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
              ...next.pageType.availableAttributes.edges
            ],
            pageInfo: next.pageType.availableAttributes.pageInfo
          }
        }
      };
    },
    {
      after: result.data.pageType.availableAttributes.pageInfo.endCursor
    }
  )
);
