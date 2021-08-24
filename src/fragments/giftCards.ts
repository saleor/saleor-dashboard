import gql from "graphql-tag";

export const fragmentGiftCardsSettings = gql`
  fragment GiftCardsSettingsFragment on GiftCardSettings {
    expiryType
    expiryPeriod {
      type
      amount
    }
  }
`;
