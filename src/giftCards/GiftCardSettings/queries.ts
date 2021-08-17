import { fragmentGiftCardsSettings } from "@saleor/fragments/giftCards";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { GiftCardSettings } from "./types/GiftCardSettings";

export const giftCardSettings = gql`
  ${fragmentGiftCardsSettings}
  query GiftCardSettings {
    giftCardSettings {
      ...GiftCardsSettingsFragment
    }
  }
`;

export const useGiftCardSettingsQuery = makeQuery<GiftCardSettings, never>(
  giftCardSettings
);
