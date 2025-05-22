import { gql } from "@apollo/client";

export const quickSearch = gql`
  query QuickSearch($query: String!) {
    orders(first: 5, filter: { search: $query }) {
      edges {
        node {
          id
          number
          status
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
          media {
            alt
            url(size: 64)
          }
          product {
            id
            category {
              name
            }
          }
        }
      }
    }
  }
`;
