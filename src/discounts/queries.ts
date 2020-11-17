import {
  saleDetailsFragment,
  saleFragment,
  voucherDetailsFragment,
  voucherFragment
} from "@saleor/fragments/discounts";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { SaleDetails, SaleDetailsVariables } from "./types/SaleDetails";
import { SaleList, SaleListVariables } from "./types/SaleList";
import {
  VoucherDetails,
  VoucherDetailsVariables
} from "./types/VoucherDetails";
import { VoucherList, VoucherListVariables } from "./types/VoucherList";

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
export const useSaleDetails = makeQuery<SaleDetails, SaleDetailsVariables>(
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
export const useVoucherDetails = makeQuery<
  VoucherDetails,
  VoucherDetailsVariables
>(voucherDetails);
