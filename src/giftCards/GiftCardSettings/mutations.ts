import { giftCardSettingsErrorFragment } from "@saleor/fragments/errors";
import { fragmentGiftCardsSettings } from "@saleor/fragments/giftCards";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  GiftCardSettingsUpdate,
  GiftCardSettingsUpdateVariables
} from "./types/GiftCardSettingsUpdate";

const giftCardSettingsUpdate = gql`
  ${giftCardSettingsErrorFragment}
  ${fragmentGiftCardsSettings}
  mutation GiftCardSettingsUpdate($input: GiftCardSettingsUpdateInput!) {
    giftCardSettingsUpdate(input: $input) {
      errors {
        ...GiftCardSettingsErrorFragment
      }
      giftCardSettings {
        ...GiftCardsSettingsFragment
      }
    }
  }
`;

export const useGiftCardSettingsUpdateMutation = makeMutation<
  GiftCardSettingsUpdate,
  GiftCardSettingsUpdateVariables
>(giftCardSettingsUpdate);
