import gql from "graphql-tag";

import { pageInfoFragment } from "./pageInfo";

export const saleFragment = gql`
  fragment SaleFragment on Sale {
    id
    name
    type
    startDate
    endDate
    channelListing {
      id
      channel {
        id
        name
      }
      discountValue
      currency
    }
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
    countries {
      code
      country
    }
    minCheckoutItemsQuantity
    channelListing {
      id
      channel {
        id
        name
      }
      discountValue
      currency
      minSpent {
        amount
        currency
      }
    }
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
