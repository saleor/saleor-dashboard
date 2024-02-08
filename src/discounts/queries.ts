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

export const discountList = gql`
  query PromotionsList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $where: PromotionWhereInput
    $sort: PromotionSortingInput
  ) {
    promotions(
      after: $after
      before: $before
      first: $first
      last: $last
      where: $where
      sortBy: $sort
    ) {
      edges {
        node {
          ...Promotion
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

export const voucherCodes = gql`
  query VoucherCodes(
    $id: ID!
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    voucher(id: $id) {
      codes(first: $first, last: $last, before: $before, after: $after) {
        edges {
          node {
            ...VoucherCode
          }
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
  }
`;

export const promotionDetails = gql`
  query PromotionDetails($id: ID!) {
    promotion(id: $id) {
      ...PromotionDetails
    }
  }
`;

export const ruleConditionsSelectedOptionsDetails = gql`
  query RuleConditionsSelectedOptionsDetails(
    $categoriesIds: [ID!]
    $collectionsIds: [ID!]
    $productsIds: [ID!]
    $variantsIds: [ID!]
  ) {
    categories(first: 20, where: { ids: $categoriesIds }) {
      edges {
        node {
          id
          name
        }
      }
    }

    collections(first: 20, where: { ids: $collectionsIds }) {
      edges {
        node {
          id
          name
        }
      }
    }

    products(first: 20, where: { ids: $productsIds }) {
      edges {
        node {
          id
          name
        }
      }
    }

    productVariants(first: 20, where: { ids: $variantsIds }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const PromotionDetailsQuery = /* GraphQL */ `
  query PromotionDetailsQuery($id: ID!) {
    promotion(id: $id) {
      id
      name
      description
      startDate
      endDate
      type
      rules {
        id
        name
        description
        channels {
          id
          isActive
          name
          slug
          currencyCode
          defaultCountry {
            code
            country
          }
          stockSettings {
            allocationStrategy
          }
          hasOrders
          orderSettings {
            markAsPaidStrategy
            deleteExpiredOrdersAfter
            allowUnpaidOrders
          }
          paymentSettings {
            defaultTransactionFlowStrategy
          }
        }
        # giftIds TODO: add this when gifts will be implemented
        rewardType
        rewardValueType
        rewardValue
        cataloguePredicate
        orderPredicate
      }
    }
  }
`;
