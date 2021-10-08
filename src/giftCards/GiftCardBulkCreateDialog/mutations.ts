import makeMutation from "@saleorhooks/makeMutation";
import gql from "graphql-tag";

import {
  GiftCardBulkCreate,
  GiftCardBulkCreateVariables
} from "./types/GiftCardBulkCreate";

const giftCardBulkCreate = gql`
  mutation GiftCardBulkCreate($input: GiftCardBulkCreateInput!) {
    giftCardBulkCreate(input: $input) {
      giftCard {
        code
      }
      errors {
        code
        field
      }
    }
  }
`;

export const useGiftCardBulkCreateMutation = makeMutation<
  GiftCardBulkCreate,
  GiftCardBulkCreateVariables
>(giftCardBulkCreate);
