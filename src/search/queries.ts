import { gql } from "@apollo/client";

export const globalSearch = gql`
  query GlobalSearch(
    $query: String!
    $includeOrders: Boolean!
    $includeCategories: Boolean!
    $includeCollections: Boolean!
    $includeProducts: Boolean!
    $includeVariants: Boolean!
    $includeModels: Boolean!
    $includeModelTypes: Boolean!
  ) {
    orders(first: 10, filter: { search: $query }) @include(if: $includeOrders) {
      edges {
        node {
          id
          number
          status
          updatedAt
          paymentStatus
          chargeStatus
          total {
            gross {
              amount
              currency
            }
          }
        }
      }
    }

    categories(first: 10, filter: { search: $query }) @include(if: $includeCategories) {
      edges {
        node {
          id
          name
          updatedAt
          backgroundImage(size: 64) {
            url
            alt
          }
          products(first: 1) {
            totalCount
          }
          parent {
            id
            name
          }
          level
          ancestors(first: 1) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }

    collections(first: 10, filter: { search: $query }) @include(if: $includeCollections) {
      edges {
        node {
          id
          name
          products(first: 1) {
            totalCount
          }
          backgroundImage(size: 64) {
            url
            alt
          }
        }
      }
    }

    products(first: 10, filter: { search: $query }) @include(if: $includeProducts) {
      edges {
        node {
          id
          category {
            name
          }
          name
          updatedAt
          thumbnail(size: 64) {
            alt
            url
          }
        }
      }
    }

    productVariants(first: 10, filter: { search: $query }) @include(if: $includeVariants) {
      edges {
        node {
          id
          name
          sku
          updatedAt
          media {
            alt
            url(size: 64)
          }
          product {
            id
            name
            category {
              name
            }
          }
        }
      }
    }

    models: pages(first: 10, filter: { search: $query }) @include(if: $includeModels) {
      edges {
        node {
          id
          title
          publishedAt
          pageType {
            name
          }
        }
      }
    }

    modelTypes: pageTypes(first: 5, filter: { search: $query }) @include(if: $includeModelTypes) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
