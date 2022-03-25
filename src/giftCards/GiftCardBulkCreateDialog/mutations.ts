import { gql } from "@apollo/client";

export const giftCardBulkCreate = gql`
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
