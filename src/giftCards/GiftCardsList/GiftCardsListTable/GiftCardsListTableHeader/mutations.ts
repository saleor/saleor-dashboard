import { gql } from "@apollo/client";

export const giftCardBulkActivate = gql`
  mutation GiftCardBulkActivate($ids: [ID!]!) {
    giftCardBulkActivate(ids: $ids) {
      errors {
        ...GiftCardError
      }
      count
    }
  }
`;

export const giftCardBulkDeactivate = gql`
  mutation GiftCardBulkDeactivate($ids: [ID!]!) {
    giftCardBulkDeactivate(ids: $ids) {
      errors {
        ...GiftCardError
      }
      count
    }
  }
`;
