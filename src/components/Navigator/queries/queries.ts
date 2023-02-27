import { gql } from "@apollo/client";

export const checkIfOrderExists = gql`
  query CheckIfOrderExists($id: ID!) {
    order(id: $id) {
      id
      status
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
