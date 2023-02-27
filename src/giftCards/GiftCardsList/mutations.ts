import { gql } from "@apollo/client";

export const deleteGiftCard = gql`
  mutation DeleteGiftCard($id: ID!) {
    giftCardDelete(id: $id) {
      errors {
        ...GiftCardError
      }
    }
  }
`;

export const bulkDeleteGiftCard = gql`
  mutation BulkDeleteGiftCard($ids: [ID!]!) {
    giftCardBulkDelete(ids: $ids) {
      errors {
        ...GiftCardError
      }
    }
  }
`;
