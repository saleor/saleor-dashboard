import { giftCardErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { giftCardDataFragment } from "./queries";
import {
  GiftCardUpdate,
  GiftCardUpdateVariables
} from "./types/GiftCardUpdate";

const giftCardUpdate = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  mutation GiftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {
    giftCardUpdate(id: $id, input: $input) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const useGiftCardUpdateMutation = makeMutation<
  GiftCardUpdate,
  GiftCardUpdateVariables
>(giftCardUpdate);
