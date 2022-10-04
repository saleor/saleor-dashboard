import { gql } from "@apollo/client";

export const saleList = gql`
  query SaleList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: SaleFilterInput
    $sort: SaleSortingInput
    $channel: String
  ) {
    sales(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          ...Sale
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const voucherList = gql`
  query VoucherList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: VoucherFilterInput
    $sort: VoucherSortingInput
    $channel: String
  ) {
    vouchers(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
      channel: $channel
    ) {
      edges {
        node {
          ...Voucher
        }
      }
      pageInfo {
        ...PageInfo
      }
    }
  }
`;

export const saleDetails = gql`
  query SaleDetails(
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $includeVariants: Boolean!
    $includeProducts: Boolean!
    $includeCollections: Boolean!
    $includeCategories: Boolean!
  ) {
    sale(id: $id) {
      ...SaleDetails
    }
  }
`;

export const voucherDetails = gql`
  query VoucherDetails(
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $includeProducts: Boolean!
    $includeCollections: Boolean!
    $includeCategories: Boolean!
  ) {
    voucher(id: $id) {
      ...VoucherDetails
    }
  }
`;
