import { gql } from "@apollo/client";

/**
 * Deliberately not the shared `UserAccountUpdate`: that one omits `user { id }`, so Apollo
 * cannot normalize the result back into `me` and the sidebar would not react to a pin change.
 */
export const updateUserNavigationPins = gql`
  mutation UpdateUserNavigationPins($input: AccountInput!) {
    accountUpdate(input: $input) {
      errors {
        field
        message
        code
      }
      user {
        id
        metadata {
          key
          value
        }
      }
    }
  }
`;

export const updateShopNavigationPins = gql`
  mutation UpdateShopNavigationPins($input: ShopSettingsInput!) {
    shopSettingsUpdate(input: $input) {
      errors {
        field
        message
        code
      }
      shop {
        id
        metadata {
          key
          value
        }
      }
    }
  }
`;
