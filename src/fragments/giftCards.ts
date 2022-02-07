import { gql } from "@apollo/client";

export const fragmentGiftCardsSettings = gql`
  fragment GiftCardsSettingsFragment on GiftCardSettings {
    expiryType
    expiryPeriod {
      type
      amount
    }
  }
`;
