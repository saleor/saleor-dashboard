import { gql } from "@apollo/client";
import { getOperationAST } from "graphql";

export const giftCardDetails = gql`
  query GiftCardDetails($id: ID!) {
    giftCard(id: $id) {
      ...GiftCardData
      events {
        ...GiftCardEvent
      }
    }
  }
`;

export const GIFT_CARD_DETAILS_QUERY = getOperationAST(giftCardDetails).name
  .value;
