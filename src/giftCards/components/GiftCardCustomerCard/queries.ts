import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  CustomerGiftCardList,
  CustomerGiftCardListVariables
} from "./types/CustomerGiftCardList";

const customerGiftCardListQuery = gql`
  query CustomerGiftCardList($first: Int, $filter: GiftCardFilterInput) {
    giftCards(first: $first, filter: $filter) {
      edges {
        node {
          id
          displayCode
          expiryDate
          isActive
        }
      }
    }
  }
`;

export const useCustomerGiftCardQuery = makeQuery<
  CustomerGiftCardList,
  CustomerGiftCardListVariables
>(customerGiftCardListQuery);

export const CUSTOMER_GIFT_CARD_LIST_QUERY = "CustomerGiftCardList";
