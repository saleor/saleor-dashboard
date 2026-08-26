import { gql } from "@apollo/client";

/**
 * Staging (3.24) twins of the attribute documents that select storefront faceted navigation
 * settings. They are identical to their `queries.ts` counterparts minus the
 * `...AttributeFacetedNavigation` spread, which the 3.24 schema no longer accepts.
 *
 * Delete this file and the fragment once staging becomes main.
 */

export const attributeDetailsStaging = gql`
  query AttributeDetails(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
    $searchValues: String
  ) {
    attribute(id: $id) {
      ...AttributeDetails
      ...AttributeAssignedTypes
      ...Metadata
    }
  }
`;

export const attributeListStaging = gql`
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
          ...Attribute
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const pageTypeAssignedAttributesForListStaging = gql`
  query PageTypeAssignedAttributesForList($id: ID!) {
    pageType(id: $id) {
      id
      attributes {
        ...AttributeAssignedList
      }
    }
  }
`;

export const productTypeAssignedAttributesForListStaging = gql`
  query ProductTypeAssignedAttributesForList($id: ID!) {
    productType(id: $id) {
      id
      productAttributes {
        ...AttributeAssignedList
      }
      variantAttributes {
        ...AttributeAssignedList
      }
    }
  }
`;
