import gql from "graphql-tag";

import { pageInfoFragment } from "./pageInfo";

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
