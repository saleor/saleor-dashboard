import { giftCardErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  BulkDeleteGiftCard,
  BulkDeleteGiftCardVariables
} from "./types/BulkDeleteGiftCard";
import {
  DeleteGiftCard,
  DeleteGiftCardVariables
} from "./types/DeleteGiftCard";

const deleteGiftCard = gql`
  ${giftCardErrorFragment}
  mutation DeleteGiftCard($id: ID!) {
    giftCardDelete(id: $id) {
      errors {
        ...GiftCardError
      }
    }
  }
`;

export const useGiftCardDeleteMutation = makeMutation<
  DeleteGiftCard,
  DeleteGiftCardVariables
>(deleteGiftCard);

const bulkDeleteGiftCard = gql`
  ${giftCardErrorFragment}
  mutation BulkDeleteGiftCard($ids: [ID]!) {
    giftCardBulkDelete(ids: $ids) {
      errors {
        ...GiftCardError
      }
    }
  }
`;

export const useGiftCardBulkDeleteMutation = makeMutation<
  BulkDeleteGiftCard,
  BulkDeleteGiftCardVariables
>(bulkDeleteGiftCard);
