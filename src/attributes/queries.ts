import {
  attributeDetailsFragment,
  attributeFragment
} from "@saleor/fragments/attributes";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  AttributeDetails,
  AttributeDetailsVariables
} from "./types/AttributeDetails";
import { AttributeList, AttributeListVariables } from "./types/AttributeList";

const attributeDetails = gql`
  ${attributeDetailsFragment}
  query AttributeDetails($id: ID!) {
    attribute(id: $id) {
      ...AttributeDetailsFragment
    }
  }
`;
export const useAttributeDetailsQuery = makeQuery<
  AttributeDetails,
  AttributeDetailsVariables
>(attributeDetails);

const attributeList = gql`
  ${attributeFragment}
  ${pageInfoFragment}
  query AttributeList(
    $filter: AttributeFilterInput
    $before: String
    $after: String
    $first: Int
    $last: Int
    $sort: AttributeSortingInput
  ) {
    attributes(
      filter: $filter
      before: $before
      after: $after
      first: $first
      last: $last
      sortBy: $sort
    ) {
      edges {
        node {
          ...AttributeFragment
          values {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useAttributeListQuery = makeQuery<
  AttributeList,
  AttributeListVariables
>(attributeList);
