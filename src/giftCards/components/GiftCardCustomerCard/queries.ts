import { fragmentMoney } from "@saleor/fragments/products";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  CustomerGiftCardList,
  CustomerGiftCardListVariables
} from "./types/CustomerGiftCardList";

const customerGiftCardListQuery = gql`
  ${fragmentMoney}
  query CustomerGiftCardList($first: Int, $filter: GiftCardFilterInput) {
    giftCards(first: $first, filter: $filter) {
      edges {
        node {
          id
          last4CodeChars
          expiryDate
          isActive
          currentBalance {
            ...Money
          }
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
