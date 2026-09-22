import { gql } from "@apollo/client";

// A dedicated account update that selects `user { id metadata }` so Apollo
// normalizes the result back into the `me` User in the cache (the shared
// UserAccountUpdate mutation omits `id`, so it does not update `useUser`).
export const updateExtensionPreferences = gql`
  mutation UpdateExtensionPreferences($input: AccountInput!) {
    accountUpdate(input: $input) {
      user {
        id
        metadata {
          key
          value
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;
