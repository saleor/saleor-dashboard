import { gql } from "@apollo/client";

/**
 * Organization pins are a single Shop metadata key. User pins ride along on the existing
 * `UserDetails` query, so they need no query of their own.
 */
export const shopNavigationPins = gql`
  query ShopNavigationPins {
    shop {
      id
      metadata {
        key
        value
      }
    }
  }
`;
