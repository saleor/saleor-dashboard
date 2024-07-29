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
        }
      }
    }

    collections(first: $first, filter: { search: $query }) {
      edges {
        node {
          ...Collection
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
        }
      }
    }
  }
`;
