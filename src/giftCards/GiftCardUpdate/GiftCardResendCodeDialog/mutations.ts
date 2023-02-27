import { gql } from "@apollo/client";

export const giftCardResend = gql`
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
