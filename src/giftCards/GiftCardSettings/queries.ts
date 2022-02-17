import { gql } from "@apollo/client";

export const giftCardSettings = gql`
  query GiftCardSettings {
    giftCardSettings {
      ...GiftCardsSettings
    }
  }
`;
