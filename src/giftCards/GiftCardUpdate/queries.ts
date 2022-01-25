import { fragmentUserBase } from "@saleor/fragments/auth";
import { metadataFragment } from "@saleor/fragments/metadata";
import { fragmentMoney } from "@saleor/fragments/products";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import {
  GiftCardDetails,
  GiftCardDetailsVariables
} from "./types/GiftCardDetails";

export const giftCardDataFragment = gql`
  ${fragmentMoney}
  ${metadataFragment}
  ${fragmentUserBase}
  fragment GiftCardData on GiftCard {
    ...MetadataFragment
    last4CodeChars
    boughtInChannel
    createdBy {
      ...UserBase
    }
    product {
      id
      name
    }
    createdBy {
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
    lastUsedOn
    isActive
    initialBalance {
      ...Money
    }
    currentBalance {
      ...Money
    }

    id
    tags {
      name
    }
  }
`;

export const giftCardDetails = gql`
  ${giftCardDataFragment}
  query GiftCardDetails($id: ID!) {
    giftCard(id: $id) {
      ...GiftCardData
      events {
        expiryDate
        oldExpiryDate
        id
        date
        type
        user {
          ...UserBase
          email
        }
        app {
          id
          name
        }
        message
        orderId
        orderNumber
        tags
        oldTags
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
      }
    }
  }
`;

export const giftCardEventsFragment = gql`
  fragment GiftCardEvent on GiftCardEvent {
    expiryDate
    oldExpiryDate
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
    tags
    oldTags
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
  }
`;

export const useGiftCardDetailsQuery = makeQuery<
  GiftCardDetails,
  GiftCardDetailsVariables
>(giftCardDetails);

export const GIFT_CARD_DETAILS_QUERY = "GiftCardDetails";
