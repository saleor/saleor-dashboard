import { fragmentUserBase } from "@saleor/fragments/auth";
import { fragmentMoney } from "@saleor/fragments/products";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { GiftCardList, GiftCardListVariables } from "./types/GiftCardList";
import { GiftCardProductsCount } from "./types/GiftCardProductsCount";

export const giftCardList = gql`
  ${fragmentUserBase}
  ${fragmentMoney}
  query GiftCardList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: GiftCardFilterInput
  ) {
    giftCards(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
    ) {
      edges {
        node {
          id
          usedByEmail
          displayCode
          isActive
          expiryDate
          product {
            id
            name
          }
          tag
          usedBy {
            ...UserBase
          }
          currentBalance {
            ...Money
          }
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

export const giftCardProductsCount = gql`
  query GiftCardProductsCount {
    giftCardProductTypes: productTypes(filter: { kind: GIFT_CARD }) {
      totalCount
    }
    giftCardProducts: products(filter: { giftCard: true }) {
      totalCount
    }
  }
`;

export const useGiftCardProductsCountQuery = makeQuery<
  GiftCardProductsCount,
  never
>(giftCardProductsCount);
