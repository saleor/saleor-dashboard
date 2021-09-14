import { giftCardErrorFragment } from "@saleor/fragments/errors";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { giftCardDataFragment } from "../queries";
import {
  GiftCardResend,
  GiftCardResendVariables
} from "./types/GiftCardResend";

const giftCardResend = gql`
  ${giftCardDataFragment}
  ${giftCardErrorFragment}
  mutation GiftCardResend($input: GiftCardResendInput!) {
    giftCardResend(input: $input) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const useGiftCardResendCodeMutation = makeMutation<
  GiftCardResend,
  GiftCardResendVariables
>(giftCardResend);
