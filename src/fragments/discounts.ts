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
    variantsCount: variants {
      totalCount
    }
    productsCount: products {
      totalCount
    }
    collectionsCount: collections {
      totalCount
    }
    categoriesCount: categories {
      totalCount
    }
    variants(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeVariants) {
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
    }
    products(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeProducts) {
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
    }
    categories(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeCategories) {
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
    }
    collections(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeCollections) {
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
    }
  }
`;

export const voucherFragment = gql`
  fragment Voucher on Voucher {
    ...Metadata
    id
    name
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

export const voucherCodeFragment = gql`
  fragment VoucherCode on VoucherCode {
    code
    used
    isActive
  }
`;

export const voucherDetailsFragment = gql`
  fragment VoucherDetails on Voucher {
    ...Voucher
    usageLimit
    used
    applyOncePerOrder
    applyOncePerCustomer
    onlyForStaff
    singleUse
    variantsCount: variants {
      totalCount
    }
    productsCount: products {
      totalCount
    }
    collectionsCount: collections {
      totalCount
    }
    categoriesCount: categories {
      totalCount
    }
    products(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeProducts) {
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
    }
    collections(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeCollections) {
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
    }
    categories(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeCategories) {
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
    }
    variants(after: $after, before: $before, first: $first, last: $last)
      @include(if: $includeVariants) {
      edges {
        node {
          id
          name
          product {
            id
            name
            thumbnail {
              url
              __typename
            }
            productType {
              id
              name
              __typename
            }
            channelListings {
              ...ChannelListingProductWithoutPricing
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      pageInfo {
        ...PageInfo
        __typename
      }
      __typename
    }
  }
`;

export const promotionRuleChannelFragment = gql`
  fragment PromotionRuleChannel on Channel {
    id
    isActive
    name
    slug
    currencyCode
    defaultCountry {
      code
      country
    }
  }
`;

export const promotionRuleDetailsFragment = gql`
  fragment PromotionRuleDetails on PromotionRule {
    id
    name
    description
    channels {
      ...PromotionRuleChannel
    }
    giftIds
    rewardType
    rewardValueType
    rewardValue
    cataloguePredicate
    orderPredicate
  }
`;

export const promotionDetailsFragments = gql`
  fragment PromotionDetails on Promotion {
    id
    name
    type
    description
    startDate
    endDate
    rules {
      ...PromotionRuleDetails
    }
  }
`;

export const promotionFragment = gql`
  fragment Promotion on Promotion {
    ...Metadata
    id
    name
    startDate
    endDate
    type
  }
`;
