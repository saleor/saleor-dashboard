import { gql } from "@apollo/client";

export const updateUserMetadata = gql`
  mutation UpdateUserMetadata($id: ID!, $input: [MetadataInput!]!) {
    updateMetadata(id: $id, input: $input) {
      errors {
        ...MetadataError
      }
    }
  }
`;
