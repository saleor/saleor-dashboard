import { gql } from "@apollo/client";

export const productTypeListQuery = gql`
  query ProductTypeList(
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
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const productTypeDetailsQuery = gql`
  query ProductTypeDetails($id: ID!) {
    productType(id: $id) {
      ...ProductTypeDetails
    }
    shop {
      defaultWeightUnit
    }
    taxTypes {
      taxCode
      description
    }
  }
`;

export const productTypeCreateDataQuery = gql`
  query ProductTypeCreateData {
    shop {
      defaultWeightUnit
    }
    taxTypes {
      taxCode
      description
    }
  }
`;
