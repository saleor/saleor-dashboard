import { fragmentUserBase } from "@saleor/fragments/auth";
import { fragmentMoney } from "@saleor/fragments/products";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { GiftCardList, GiftCardListVariables } from "./types/GiftCardList";
import { GiftCardProductsCount } from "./types/GiftCardProductsCount";
import { GiftCardTotalCount } from "./types/GiftCardTotalCount";

export const giftCardList = gql`
  ${fragmentUserBase}
  ${fragmentMoney}
  query GiftCardList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: GiftCardFilterInput
    $sort: GiftCardSortingInput
  ) {
    giftCards(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          id
          usedByEmail
          last4CodeChars
          isActive
          expiryDate
          product {
            id
            name
          }
          tags {
            name
          }
          usedBy {
            ...UserBase
          }
          currentBalance {
            ...Money
          }
        }
      }
      totalCount
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const giftCardTotalCount = gql`
  query GiftCardTotalCount {
    giftCards {
      totalCount
    }
  }
`;

export const useGiftCardTotalCountQuery = makeQuery<GiftCardTotalCount, {}>(
  giftCardTotalCount
);

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
