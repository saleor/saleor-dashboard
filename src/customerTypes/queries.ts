import { gql } from "@apollo/client";

export const customerTypeListQuery = gql`
  query CustomerTypeList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $sort: CustomerTypeSortingInput
  ) {
    customerTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      sortBy: $sort
    ) {
      edges {
        node {
          ...CustomerType
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const customerTypeDetailsQuery = gql`
  query CustomerTypeDetails($id: ID!) {
    customerType(id: $id) {
      ...CustomerTypeDetails
    }
  }
`;

export const customerTypeAssignedCustomersCountQuery = gql`
  query CustomerTypeAssignedCustomersCount($id: ID!) {
    customers(first: 1, where: { customerType: { eq: $id } }) {
      totalCount
    }
  }
`;

export const defaultGraphiQLQuery = `query CustomerTypeDetails($id: ID!) {
  customerType(id: $id) {
    id
    name
    slug
    isDefault
  }
}`;
