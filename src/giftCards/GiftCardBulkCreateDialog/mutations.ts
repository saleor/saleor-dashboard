import { gql } from "@apollo/client";
import { giftCardBulkCreateErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";

import {
  GiftCardBulkCreate,
  GiftCardBulkCreateVariables
} from "./types/GiftCardBulkCreate";

const giftCardBulkCreate = gql`
  ${giftCardBulkCreateErrorFragment}
  mutation GiftCardBulkCreate($input: GiftCardBulkCreateInput!) {
    giftCardBulkCreate(input: $input) {
      giftCards {
        id
      }
      errors {
        ...GiftCardBulkCreateErrorFragment
      }
    }
  }
`;

export const useGiftCardBulkCreateMutation = makeMutation<
  GiftCardBulkCreate,
  GiftCardBulkCreateVariables
>(giftCardBulkCreate);
