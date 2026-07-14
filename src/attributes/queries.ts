import { gql } from "@apollo/client";

export const attributeDetails = gql`
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

export const attributeList = gql`
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

export const pageTypeAssignedAttributesForList = gql`
  query PageTypeAssignedAttributesForList($id: ID!) {
    pageType(id: $id) {
      id
      attributes {
        ...AttributeAssignedList
      }
    }
  }
`;

export const productTypeAssignedAttributesForList = gql`
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

export const pageTypeListWithAssignedAttributeCounts = gql`
  query PageTypeListWithAssignedAttributeCounts(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: PageTypeFilterInput
    $sort: PageTypeSortingInput
  ) {
    pageTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...PageType
          attributes {
            id
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const productTypeListWithAssignedAttributeCounts = gql`
  query ProductTypeListWithAssignedAttributeCounts(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: ProductTypeFilterInput
    $sort: ProductTypeSortingInput
  ) {
    productTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...ProductType
          productAttributes {
            id
          }
          variantAttributes {
            id
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;
