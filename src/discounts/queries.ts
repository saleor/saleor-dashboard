import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { pageInfoFragment, TypedQuery } from "../queries";
import { SaleDetails, SaleDetailsVariables } from "./types/SaleDetails";
import { SaleList, SaleListVariables } from "./types/SaleList";
import {
  VoucherDetails,
  VoucherDetailsVariables
} from "./types/VoucherDetails";
import { VoucherList, VoucherListVariables } from "./types/VoucherList";

export const saleFragment = gql`
  fragment SaleFragment on Sale {
    id
    name
    type
    startDate
    endDate
    value
  }
`;

export const saleDetailsFragment = gql`
  ${pageInfoFragment}
  ${saleFragment}
  fragment SaleDetailsFragment on Sale {
    ...SaleFragment
    products(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          isPublished
          productType {
            id
            name
          }
          thumbnail {
            url
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
    categories(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          products {
            totalCount
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
    collections(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          products {
            totalCount
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
`;

export const voucherFragment = gql`
  fragment VoucherFragment on Voucher {
    id
    code
    startDate
    endDate
    usageLimit
    discountValueType
    discountValue
    countries {
      code
      country
    }
    minSpent {
      currency
      amount
    }
    minCheckoutItemsQuantity
  }
`;

export const voucherDetailsFragment = gql`
  ${pageInfoFragment}
  ${voucherFragment}
  fragment VoucherDetailsFragment on Voucher {
    ...VoucherFragment
    type
    code
    usageLimit
    used
    applyOncePerOrder
    applyOncePerCustomer
    products(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          productType {
            id
            name
          }
          isPublished
          thumbnail {
            url
          }
        }
      }
      totalCount
      pageInfo {
        ...PageInfoFragment
      }
    }
    collections(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          products {
            totalCount
          }
        }
      }
      totalCount
      pageInfo {
        ...PageInfoFragment
      }
    }
    categories(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          products {
            totalCount
          }
        }
      }
      totalCount
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;

export const saleList = gql`
  ${pageInfoFragment}
  ${saleFragment}
  query SaleList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: SaleFilterInput
    $sort: SaleSortingInput
  ) {
    sales(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...SaleFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useSaleListQuery = makeQuery<SaleList, SaleListVariables>(
  saleList
);

export const voucherList = gql`
  ${pageInfoFragment}
  ${voucherFragment}
  query VoucherList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: VoucherFilterInput
    $sort: VoucherSortingInput
  ) {
    vouchers(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...VoucherFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useVoucherListQuery = makeQuery<VoucherList, VoucherListVariables>(
  voucherList
);

export const saleDetails = gql`
  ${saleDetailsFragment}
  query SaleDetails(
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    sale(id: $id) {
      ...SaleDetailsFragment
    }
  }
`;
export const TypedSaleDetails = TypedQuery<SaleDetails, SaleDetailsVariables>(
  saleDetails
);

const voucherDetails = gql`
  ${voucherDetailsFragment}
  query VoucherDetails(
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    voucher(id: $id) {
      ...VoucherDetailsFragment
    }
  }
`;
export const TypedVoucherDetails = TypedQuery<
  VoucherDetails,
  VoucherDetailsVariables
>(voucherDetails);
