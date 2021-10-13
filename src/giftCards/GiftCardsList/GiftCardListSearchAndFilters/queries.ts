import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { GiftCardCurrencies } from "./types/GiftCardCurrencies";

const useGiftCardCurrencies = gql`
  query GiftCardCurrencies {
    giftCardCurrencies
  }
`;

export const useGiftCardCurrenciesQuery = makeQuery<GiftCardCurrencies, {}>(
  useGiftCardCurrencies
);
