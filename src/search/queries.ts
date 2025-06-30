import { gql } from "@apollo/client";

export const globalSearch = gql`
  query GlobalSearch($query: String!) {
    orders(first: 5, filter: { search: $query }) {
      edges {
        node {
          id
          number
          status
          updatedAt
          total {
            gross {
              amount
              currency
            }
          }
        }
      }
    }

    categories(first: 5, filter: { search: $query }) {
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
        }
      }
    }

    collections(first: 5, filter: { search: $query }) {
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

    products(first: 5, filter: { search: $query }) {
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

    productVariants(first: 5, filter: { search: $query }) {
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

    models: pages(first: 5, filter: { search: $query }) {
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

    modelTypes: pageTypes(first: 5, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
