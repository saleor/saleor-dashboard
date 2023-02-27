import { gql } from "@apollo/client";
import { getOperationAST } from "graphql";

export const giftCardList = gql`
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

export const GIFT_CARD_LIST_QUERY = getOperationAST(giftCardList).name.value;

export const giftCardTotalCount = gql`
  query GiftCardTotalCount {
    giftCards {
      totalCount
    }
  }
`;

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
