import { gql } from "@apollo/client";

export const searchOrdersByNumber = gql`
  query SearchOrdersByNumber($first: Int!, $query: [String!]) {
    orders(first: $first, filter: { numbers: $query }) {
      edges {
        node {
          id
          number
          status
        }
      }
    }
  }
`;

export const searchCatalog = gql`
  query SearchCatalog($first: Int!, $query: String!) {
    categories(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          backgroundImage(size: 64) {
            url
            alt
          }
          level
        }
      }
    }

    collections(first: $first, filter: { search: $query }) {
      edges {
        node {
          ...Collection
          backgroundImage(size: 64) {
            url
            alt
          }
        }
      }
    }

    products(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          category {
            id
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

    productVariants(first: $first, filter: { search: $query }) {
      edges {
        node {
          id
          name
          sku
          product {
            id
            name
            category {
              id
              name
            }
            thumbnail(size: 64) {
              alt
              url
            }
          }
        }
      }
    }
  }
`;
