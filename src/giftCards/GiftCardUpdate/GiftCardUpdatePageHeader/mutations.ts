import { giftCardErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { giftCardDataFragment } from "../queries";
import {
  GiftCardActivate,
  GiftCardActivateVariables
} from "./types/GiftCardActivate";
import {
  GiftCardDeactivate,
  GiftCardDeactivateVariables
} from "./types/GiftCardDeactivate";

const giftCardActivate = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  mutation GiftCardActivate($id: ID!) {
    giftCardActivate(id: $id) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const useGiftCardActivateMutation = makeMutation<
  GiftCardActivate,
  GiftCardActivateVariables
>(giftCardActivate);

const giftCardDeactivate = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  mutation GiftCardDeactivate($id: ID!) {
    giftCardDeactivate(id: $id) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const useGiftCardDeactivateMutation = makeMutation<
  GiftCardDeactivate,
  GiftCardDeactivateVariables
>(giftCardDeactivate);
