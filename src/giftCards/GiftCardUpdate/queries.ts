import { fragmentUserBase } from "@saleor/fragments/auth";
import { metadataFragment } from "@saleor/fragments/metadata";
import { fragmentMoney } from "@saleor/fragments/products";
import { fragmentTimePeriod } from "@saleor/fragments/timePeriod";
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
  ${fragmentTimePeriod}
  fragment GiftCardData on GiftCard {
    ...MetadataFragment
    displayCode
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

    id
    tag
  }
`;

export const giftCardDetails = gql`
  ${giftCardDataFragment}
  query GiftCardDetails($id: ID!) {
    giftCard(id: $id) {
      ...GiftCardData
      events {
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
      }
    }
  }
`;

export const useGiftCardDetailsQuery = makeQuery<
  GiftCardDetails,
  GiftCardDetailsVariables
>(giftCardDetails);
