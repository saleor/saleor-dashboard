import { gql } from "@apollo/client";

export const giftCardActivate = gql`
  mutation GiftCardActivate($id: ID!) {
    giftCardActivate(id: $id) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;

export const giftCardDeactivate = gql`
  mutation GiftCardDeactivate($id: ID!) {
    giftCardDeactivate(id: $id) {
      errors {
        ...GiftCardError
      }
      giftCard {
        ...GiftCardData
      }
    }
  }
`;
