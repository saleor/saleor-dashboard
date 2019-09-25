import gql from "graphql-tag";

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
    $inCategory: ID
    $inCollection: ID
    $before: String
    $after: String
    $first: Int
    $last: Int
  ) {
    attributes(
      filter: $filter
      inCategory: $inCategory
      inCollection: $inCollection
      before: $before
      after: $after
      first: $first
      last: $last
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
export const AttributeListQuery = TypedQuery<
  AttributeList,
  AttributeListVariables
>(attributeList);
