import { gql } from "@apollo/client";
import makeMutation from "@saleor/hooks/makeMutation";

import {
  GiftCardCreate,
  GiftCardCreateVariables
} from "./types/GiftCardCreate";

const giftCardCreate = gql`
  mutation GiftCardCreate($input: GiftCardCreateInput!) {
    giftCardCreate(input: $input) {
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

export const useGiftCardCreateMutation = makeMutation<
  GiftCardCreate,
  GiftCardCreateVariables
>(giftCardCreate);
