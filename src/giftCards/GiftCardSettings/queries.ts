import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { GiftCardSettings } from "./types/GiftCardSettings";

export const giftCardSettings = gql`
  query GiftCardSettings {
    giftCardSettings {
      expiryType
      expiryPeriod {
        type
        amount
      }
    }
  }
`;

export const useGiftCardSettingsQuery = makeQuery<GiftCardSettings, never>(
  giftCardSettings
);
