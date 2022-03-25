import { gql } from "@apollo/client";

export const saleFragment = gql`
  fragment Sale on Sale {
    ...Metadata
    id
    name
    type
    startDate
    endDate
    channelListings {
      id
      channel {
        id
        name
        currencyCode
      }
      discountValue
      currency
    }
  }
`;

export const saleDetailsFragment = gql`
  fragment SaleDetails on Sale {
    ...Sale
    variants(after: $after, before: $before, first: $first, last: $last) {
      edges {
        node {
          id
          name
          product {
            id
            name
            thumbnail {
              url
            }
            productType {
              id
              name
            }
            channelListings {
              ...ChannelListingProductWithoutPricing
            }
          }
        }
      }
      pageInfo {
        ...PageInfo
      }
      totalCount
    }
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
          channelListings {
            ...ChannelListingProductWithoutPricing
          }
        }
      }
      pageInfo {
        ...PageInfo
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
        ...PageInfo
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
        ...PageInfo
      }
      totalCount
    }
  }
`;

export const voucherFragment = gql`
  fragment Voucher on Voucher {
    ...Metadata
    id
    code
    startDate
    endDate
    usageLimit
    type
    discountValueType
    countries {
      code
      country
    }
    minCheckoutItemsQuantity
    channelListings {
      id
      channel {
        id
        name
        currencyCode
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
  fragment VoucherDetails on Voucher {
    ...Voucher
    code
    usageLimit
    used
    applyOncePerOrder
    applyOncePerCustomer
    onlyForStaff
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
          channelListings {
            ...ChannelListingProductWithoutPricing
          }
        }
      }
      totalCount
      pageInfo {
        ...PageInfo
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
        ...PageInfo
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
        ...PageInfo
      }
    }
  }
`;
