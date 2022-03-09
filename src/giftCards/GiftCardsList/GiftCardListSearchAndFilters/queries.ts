import { gql } from "@apollo/client";

export const useGiftCardCurrencies = gql`
  query GiftCardCurrencies {
    giftCardCurrencies
  }
`;
