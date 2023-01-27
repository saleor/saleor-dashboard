import { gql } from "@apollo/client";

export const transactionEvent = gql`
  fragment TransactionEvent on TransactionEvent {
    id
    pspReference
    amount {
      ...Money
    }
    type
    message
    createdAt
    createdBy {
      ... on User {
        ...StaffMemberAvatar
      }
      ... on App {
        ...AppAvatar
      }
    }
    externalUrl
  }
`;

export const transactionItemFragment = gql`
  fragment TransactionItem on TransactionItem {
    id
    type
    pspReference
    actions
    type
    status
    externalUrl
    events {
      ...TransactionEvent
    }
    authorizedAmount {
      ...Money
    }
    chargedAmount {
      ...Money
    }
    refundedAmount {
      ...Money
    }
    canceledAmount {
      ...Money
    }
    authorizePendingAmount {
      ...Money
    }
    chargePendingAmount {
      ...Money
    }
    refundPendingAmount {
      ...Money
    }
    cancelPendingAmount {
      ...Money
    }
  }
`;

export const fragmentPayment = gql`
  fragment OrderPayment on Payment {
    id
    isActive
    actions
    gateway
    paymentMethodType
    availableCaptureAmount {
      ...Money
    }
    capturedAmount {
      ...Money
    }
    total {
      ...Money
    }
    availableRefundAmount {
      ...Money
    }
    modified
    transactions {
      id
      token
      created
      kind
      isSuccess
    }
  }
`;

export const fragmentOrderGiftcard = gql`
  fragment OrderGiftCard on GiftCard {
    id
    last4CodeChars
    events {
      id
      type
      orderId
      date
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
`;

export const fragmentOrderGrantedRefunds = gql`
  fragment OrderGrantedRefund on OrderGrantedRefund {
    id
    createdAt
    amount {
      currency
      amount
    }
    reason
    user {
      ...UserBaseAvatar
    }
    app {
      id
      name
    }
  }
`;

export const orderLineGrantRefund = gql`
  fragment OrderLineGrantRefund on OrderLine {
    id
    thumbnail {
      url
    }
    productName
    quantity
    quantityToFulfill
    variantName
    productName
    unitPrice {
      gross {
        ...Money
      }
    }
  }
`;

export const grantRefundFulfillment = gql`
  fragment OrderFulfillmentGrantRefund on Fulfillment {
    id
    fulfillmentOrder
    status
    lines {
      id
      quantity
      orderLine {
        ...OrderLineGrantRefund
      }
    }
  }
`;

export const fragmentOrderDetailsGrantRefund = gql`
  fragment OrderDetailsGrantRefund on Order {
    id
    number
    lines {
      ...OrderLineGrantRefund
    }
    fulfillments {
      ...OrderFulfillmentGrantRefund
    }
    shippingPrice {
      gross {
        ...Money
      }
    }
    total {
      gross {
        ...Money
      }
    }
  }
`;

export const fragmentOrderDetailsWithTransactions = gql`
  fragment OrderDetailsWithTransactions on Order {
    id
    token
    ...Metadata
    billingAddress {
      ...Address
    }
    transactions {
      ...TransactionItem
    }
    payments {
      ...OrderPayment
    }
    giftCards {
      ...OrderGiftCard
    }
    grantedRefunds {
      ...OrderGrantedRefund
    }
    isShippingRequired
    canFinalize
    created
    customerNote
    discounts {
      id
      type
      calculationMode: valueType
      value
      reason
      amount {
        ...Money
      }
    }
    events {
      ...OrderEvent
    }
    fulfillments {
      ...Fulfillment
    }
    lines {
      ...OrderLine
    }
    number
    isPaid
    paymentStatus
    shippingAddress {
      ...Address
    }
    deliveryMethod {
      __typename
      ... on ShippingMethod {
        id
      }
      ... on Warehouse {
        id
        clickAndCollectOption
      }
    }
    shippingMethod {
      id
    }
    shippingMethodName
    collectionPointName
    shippingPrice {
      gross {
        amount
        currency
      }
    }
    status
    subtotal {
      gross {
        ...Money
      }
      net {
        ...Money
      }
    }
    total {
      gross {
        ...Money
      }
      net {
        ...Money
      }
      tax {
        ...Money
      }
    }
    totalRemainingGrant {
      ...Money
    }
    totalGrantedRefund {
      ...Money
    }
    totalRefundPending {
      ...Money
    }
    totalRefunded {
      ...Money
    }
    actions
    totalAuthorizePending {
      ...Money
    }
    totalAuthorized {
      ...Money
    }
    totalCharged {
      ...Money
    }
    totalChargePending {
      ...Money
    }
    totalCanceled {
      ...Money
    }
    totalCancelPending {
      ...Money
    }
    totalBalance {
      ...Money
    }
    undiscountedTotal {
      net {
        ...Money
      }
      gross {
        ...Money
      }
    }
    user {
      id
      email
    }
    userEmail
    shippingMethods {
      id
      name
      price {
        ...Money
      }
      active
      message
    }
    invoices {
      ...Invoice
    }
    channel {
      isActive
      id
      name
      currencyCode
      slug
      defaultCountry {
        code
      }
    }
    isPaid
  }
`;
