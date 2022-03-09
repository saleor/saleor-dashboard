import { gql } from "@apollo/client";

export const updateMetadata = gql`
  mutation UpdateMetadata(
    $id: ID!
    $input: [MetadataInput!]!
    $keysToDelete: [String!]!
  ) {
    updateMetadata(id: $id, input: $input) {
      errors {
        ...MetadataError
      }
      item {
        ...Metadata
        ... on Node {
          id
        }
      }
    }
    deleteMetadata(id: $id, keys: $keysToDelete) {
      errors {
        ...MetadataError
      }
      item {
        ...Metadata
        ... on Node {
          id
        }
      }
    }
  }
`;

export const updatePrivateMetadata = gql`
  mutation UpdatePrivateMetadata(
    $id: ID!
    $input: [MetadataInput!]!
    $keysToDelete: [String!]!
  ) {
    updatePrivateMetadata(id: $id, input: $input) {
      errors {
        ...MetadataError
      }
      item {
        ...Metadata
        ... on Node {
          id
        }
      }
    }
    deletePrivateMetadata(id: $id, keys: $keysToDelete) {
      errors {
        ...MetadataError
      }
      item {
        ...Metadata
        ... on Node {
          id
        }
      }
    }
  }
`;
