import { gql } from "@apollo/client";
import { giftCardCreateErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";

import {
  GiftCardCreate,
  GiftCardCreateVariables
} from "./types/GiftCardCreate";

const giftCardCreate = gql`
  ${giftCardCreateErrorFragment}
  mutation GiftCardCreate($input: GiftCardCreateInput!) {
    giftCardCreate(input: $input) {
      giftCard {
        code
      }
      errors {
        ...GiftCardCreateErrorFragment
      }
    }
  }
`;

export const useGiftCardCreateMutation = makeMutation<
  GiftCardCreate,
  GiftCardCreateVariables
>(giftCardCreate);
