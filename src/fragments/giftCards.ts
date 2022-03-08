import { gql } from "@apollo/client";

export const fragmentGiftCardsSettings = gql`
  fragment GiftCardsSettings on GiftCardSettings {
    expiryType
    expiryPeriod {
      type
      amount
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
      email
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

export const giftCardDataFragment = gql`
  fragment GiftCardData on GiftCard {
    ...Metadata
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

export const customerGiftCardFragment = gql`
  fragment CustomerGiftCard on GiftCard {
    id
    last4CodeChars
    expiryDate
    isActive
    currentBalance {
      ...Money
    }
  }
`;
