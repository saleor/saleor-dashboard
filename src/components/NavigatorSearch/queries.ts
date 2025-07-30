import { gql } from "@apollo/client";

export const navigatorSearch = gql`
  query NavigatorSearch($query: String!) {
    orders(first: 2, filter: { search: $query }) {
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

    categories(first: 2, filter: { search: $query }) {
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

    collections(first: 2, filter: { search: $query }) {
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

    products(first: 2, filter: { search: $query }) {
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

    productVariants(first: 2, filter: { search: $query }) {
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

    models: pages(first: 2, filter: { search: $query }) {
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

    modelTypes: pageTypes(first: 2, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
