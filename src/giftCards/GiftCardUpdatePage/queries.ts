import { fragmentUserBase } from "@saleor/fragments/auth";
import { metadataFragment } from "@saleor/fragments/metadata";
import { fragmentMoney } from "@saleor/fragments/products";
import { fragmentTimePeriod } from "@saleor/fragments/timePeriod";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { GiftCardList, GiftCardListVariables } from "./types/GiftCardList";

export const giftCardList = gql`
  ${fragmentUserBase}
  ${fragmentMoney}
  query GiftCardList($first: Int, $after: String, $last: Int, $before: String) {
    giftCards(first: $first, after: $after, before: $before, last: $last) {
      edges {
        node {
          id
          code
          isActive
          displayCode
          tag
          product {
            id
            name
          }
          usedBy {
            ...UserBase
          }
          usedByEmail
          currentBalance {
            ...Money
          }
          initialBalance {
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

export const giftCardDetails = gql`
  ${fragmentMoney}
  ${metadataFragment}
  ${fragmentUserBase}
  ${fragmentTimePeriod}
  query GiftCardDetails($id: ID!) {
    giftCard(id: $id) {
      ...MetadataFragment
      code
      createdBy {
        ...UserBase
      }
      product {
        id
        name
      }
      user {
        ...UserBase
      }
      usedBy {
        ...UserBase
      }
      usedByEmail
      createdByEmail
      app {
        id
        name
      }
      created
      expiryDate
      expiryType
      expiryPeriod {
        ...TimePeriod
      }
      lastUsedOn
      isActive
      initialBalance {
        ...Money
      }
      currentBalance {
        ...Money
      }
      events {
        id
        date
        type
        user {
          ...UserBase
        }
        app {
          id
          name
        }
        message
        email
        orderId
        orderNumber
        tag
        oldTag
        balance {
          initialBalance {
            ...Money
          }
          currentBalance {
            ...Money
          }
          oldInitialBalance {
            ...Money
          }
          oldCurrentBalance {
            ...Money
          }
        }
        expiry {
          expiryType
          expiryPeriod {
            ...TimePeriod
          }
          expiryDate
          oldExpiryType
          oldExpiryPeriod {
            ...TimePeriod
          }
          oldExpiryDate
        }
      }
      id
      displayCode
      tag
    }
  }
`;
