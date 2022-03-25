import { gql } from "@apollo/client";

export const giftCardCreate = gql`
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
