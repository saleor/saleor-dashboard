import { gql } from "@apollo/client";

/**
 * Staging (3.24) twin of `attributeUpdateMutation`, without the `...AttributeFacetedNavigation`
 * spread. See `queries.staging.ts`.
 */
export const attributeUpdateMutationStaging = gql`
  mutation AttributeUpdate($id: ID!, $input: AttributeUpdateInput!) {
    attributeUpdate(id: $id, input: $input) {
      attribute {
        ...AttributeUpdateResult
      }
      errors {
        ...AttributeError
      }
    }
  }
`;
