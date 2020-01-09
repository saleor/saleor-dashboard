import gql from "graphql-tag";

import makeQuery from "@saleor/hooks/makeQuery";
import { pageInfoFragment, TypedQuery } from "../queries";
import {
  AttributeDetails,
  AttributeDetailsVariables
} from "./types/AttributeDetails";
import { AttributeList, AttributeListVariables } from "./types/AttributeList";

export const attributeFragment = gql`
  fragment AttributeFragment on Attribute {
    id
    name
    slug
    visibleInStorefront
    filterableInDashboard
    filterableInStorefront
  }
`;

export const attributeDetailsFragment = gql`
  ${attributeFragment}
  fragment AttributeDetailsFragment on Attribute {
    ...AttributeFragment
    availableInGrid
    inputType
    storefrontSearchPosition
    valueRequired
    values {
      id
      name
      slug
      type
    }
  }
`;

const attributeDetails = gql`
  ${attributeDetailsFragment}
  query AttributeDetails($id: ID!) {
    attribute(id: $id) {
      ...AttributeDetailsFragment
    }
  }
`;
export const AttributeDetailsQuery = TypedQuery<
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
