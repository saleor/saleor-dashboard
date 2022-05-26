import { gql } from "@apollo/client";
import { getOperationAST } from "graphql";

export const customerGiftCardListQuery = gql`
  query CustomerGiftCardList($first: Int, $filter: GiftCardFilterInput) {
    giftCards(first: $first, filter: $filter) {
      edges {
        node {
          ...CustomerGiftCard
        }
      }
    }
  }
`;

export const CUSTOMER_GIFT_CARD_LIST_QUERY = getOperationAST(
  customerGiftCardListQuery,
).name.value;
