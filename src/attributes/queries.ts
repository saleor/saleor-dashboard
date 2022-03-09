import { gql } from "@apollo/client";

export const attributeDetails = gql`
  query AttributeDetails(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attribute(id: $id) {
      ...AttributeDetails
      choices(
        first: $firstValues
        after: $afterValues
        last: $lastValues
        before: $beforeValues
      ) {
        ...AttributeValueList
      }
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
