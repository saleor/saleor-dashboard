import { gql } from "@apollo/client";

export const saveOnBoardingState = gql`
  mutation SaveOnBoardingState($id: ID!, $input: [MetadataInput!]!) {
    updateMetadata(id: $id, input: $input) {
      errors {
        ...MetadataError
      }
    }
  }
`;
