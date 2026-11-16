import { gql } from "@apollo/client";

// Each save reads back only the metadata it changed. Reading private metadata needs its own
// permission, and a response field the user can't read would fail a save that went through.
export const updateMetadata = gql`
  mutation UpdateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
    updateMetadata(id: $id, input: $input) {
      errors {
        ...MetadataError
      }
      item {
        metadata {
          ...MetadataItem
        }
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
        metadata {
          ...MetadataItem
        }
        ... on Node {
          id
        }
      }
    }
  }
`;

export const updatePrivateMetadata = gql`
  mutation UpdatePrivateMetadata($id: ID!, $input: [MetadataInput!]!, $keysToDelete: [String!]!) {
    updatePrivateMetadata(id: $id, input: $input) {
      errors {
        ...MetadataError
      }
      item {
        privateMetadata {
          ...MetadataItem
        }
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
        privateMetadata {
          ...MetadataItem
        }
        ... on Node {
          id
        }
      }
    }
  }
`;
