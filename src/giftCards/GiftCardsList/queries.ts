import { fragmentUserBase } from "@saleor/fragments/auth";
import { fragmentMoney } from "@saleor/fragments/products";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { giftCardDataFragment } from "../GiftCardUpdate/queries";
import { GiftCardList, GiftCardListVariables } from "./types/GiftCardList";

export const giftCardList = gql`
  ${fragmentUserBase}
  ${fragmentMoney}
  ${giftCardDataFragment}
  query GiftCardList($first: Int, $after: String, $last: Int, $before: String) {
    giftCards(first: $first, after: $after, before: $before, last: $last) {
      edges {
        node {
          ...GiftCardData
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const useGiftCardListQuery = makeQuery<
  GiftCardList,
  GiftCardListVariables
>(giftCardList);
