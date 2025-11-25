import { gql } from "@apollo/client";

export const fragmentOrderEvent = gql`
  fragment OrderEvent on OrderEvent {
    id
    amount
    shippingCostsIncluded

    date
    email
    emailType
    invoiceNumber
    discount {
      valueType
      value
      reason
      amount {
        amount
        currency
      }
      oldValueType
      oldValue
      oldAmount {
        amount
        currency
      }
    }
    relatedOrder {
      id
      number
    }
    related {
      id
    }
    message
    quantity
    transactionReference
    type
    user {
      id
      email
      firstName
      lastName
      avatar(size: 128) {
        url
      }
    }
    app {
      id
      name
      appUrl
      brand {
        logo {
          default(size: 128)
        }
      }
    }
    lines {
      quantity
      itemName
      discount {
        valueType
        value
        reason
        amount {
          amount
          currency
        }
        oldValueType
        oldValue
        oldAmount {
          amount
          currency
        }
      }
      orderLine {
        id
        productName
        variantName
      }
    }
  }
`;

export const fragmentOrderLine = gql`
  fragment OrderLine on OrderLine {
    id
    isShippingRequired
    allocations {
      id
      quantity
      warehouse {
        id
        name
      }
    }
    variant {
      id
      name
      quantityAvailable
      preorder {
        endDate
      }
      stocks {
        ...Stock
      }
      product {
        id
        isAvailableForPurchase
      }
    }
    productName
    productSku
    isGift
    quantity
    quantityFulfilled
    quantityToFulfill
    totalPrice {
      ...TaxedMoney
    }
    unitDiscount {
      amount
      currency
    }
    unitDiscountValue
    unitDiscountReason
    unitDiscountType
    undiscountedUnitPrice {
      currency
      gross {
        amount
        currency
      }
      net {
        amount
        currency
      }
    }
    unitPrice {
      gross {
        amount
        currency
      }
      net {
        amount
        currency
      }
    }
    thumbnail {
      url
    }
  }
`;

export const fragmentOrderLineMetadata = gql`
  fragment OrderLineMetadata on OrderLine {
    metadata {
      ...MetadataItem
    }
    privateMetadata {
      ...MetadataItem
    }
    variant {
      metadata {
        ...MetadataItem
      }
      privateMetadata @include(if: $hasManageProducts) {
        ...MetadataItem
      }
    }
  }
`;

export const fragmentOrderLineMetadataDetails = gql`
  fragment OrderLineMetadataDetails on OrderLine {
    id
    productName
    productSku
    quantity
    thumbnail {
      url
    }
    variant {
      id
      name
    }
    ...OrderLineMetadata
  }
`;

export const fragmentOrderLineWithMetadata = gql`
  fragment OrderLineWithMetadata on OrderLine {
    ...OrderLine
    ...OrderLineMetadata
  }
`;

export const fragmentRefundOrderLine = gql`
  fragment RefundOrderLine on OrderLine {
    id
    productName
    quantity
    unitPrice {
      gross {
        ...Money
      }
    }
    thumbnail(size: 64) {
      url
    }
  }
`;

export const fulfillmentFragment = gql`
  fragment Fulfillment on Fulfillment {
    ...Metadata
    id
    created
    lines {
      id
      quantity
      orderLine {
        ...OrderLine
      }
    }
    fulfillmentOrder
    status
    trackingNumber
    warehouse {
      id
      name
    }
  }
`;

export const fulfillmentFragmentWithMetadata = gql`
  fragment FulfillmentWithMetadata on Fulfillment {
    ...Fulfillment
    lines {
      orderLine {
        ...OrderLineWithMetadata
      }
    }
  }
`;

export const invoiceFragment = gql`
  fragment Invoice on Invoice {
    id
    number
    createdAt
    url
    status
  }
`;

export const orderDiscount = gql`
  fragment OrderDiscount on OrderDiscount {
    id
    type
    name
    calculationMode: valueType
    value
    reason
    amount {
      ...Money
    }
  }
`;

export const fragmentOrderDetails = gql`
  fragment OrderDetails on Order {
    id
    displayGrossPrices
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
      ...OrderDiscount
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
    # TODO: remove me
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
    # TODO: Remove me
    totalCaptured {
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
      orderSettings {
        markAsPaidStrategy
      }
    }
    chargeStatus
    authorizeStatus
  }
`;

export const fragmentOrderDetailsWithMetadata = gql`
  fragment OrderDetailsWithMetadata on Order {
    ...OrderDetails
    fulfillments {
      ...FulfillmentWithMetadata
    }
    lines {
      ...OrderLine
    }
  }
`;

export const fragmentOrderSettings = gql`
  fragment OrderSettings on OrderSettings {
    automaticallyConfirmAllNewOrders
    automaticallyFulfillNonShippableGiftCard
  }
`;

export const fragmentShopOrderSettings = gql`
  fragment ShopOrderSettings on Shop {
    fulfillmentAutoApprove
    fulfillmentAllowUnpaid
  }
`;

export const fragmentOrderFulfillLine = gql`
  fragment OrderFulfillLine on OrderLine {
    id
    isShippingRequired
    productName
    quantity
    allocations {
      id
      quantity
      warehouse {
        id
        name
      }
    }
    quantityFulfilled
    quantityToFulfill
    variant {
      id
      name
      sku
      preorder {
        endDate
      }
      attributes {
        values {
          id
          name
        }
      }
      stocks {
        ...Stock
      }
      trackInventory
    }
    thumbnail(size: 64) {
      url
    }
  }
`;

export const fragmentOrderLineStockData = gql`
  fragment OrderLineStockData on OrderLine {
    id
    allocations {
      quantity
      warehouse {
        id
      }
    }
    quantity
    quantityToFulfill
    variant {
      stocks {
        ...Stock
      }
    }
  }
`;

export const transactionBaseEvent = gql`
  fragment TransactionBaseEvent on TransactionEvent {
    id
    pspReference
    amount {
      ...Money
    }
    externalUrl
    type
    message
    createdAt
    reasonReference {
      id
      title
    }
  }
`;

export const transactionEvent = gql`
  fragment TransactionEvent on TransactionEvent {
    ...TransactionBaseEvent
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

export const transactionBaseItemFragment = gql`
  fragment TransactionBaseItem on TransactionItem {
    id
    name
    actions
    events {
      ...TransactionBaseEvent
    }
  }
`;

export const transactionItemFragment = gql`
  fragment TransactionItem on TransactionItem {
    ...TransactionBaseItem
    pspReference
    externalUrl
    createdAt
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
        ...OrderGiftCardEventBalance
      }
    }
  }
`;

export const fragmentOrderGiftCardEventBalance = gql`
  fragment OrderGiftCardEventBalance on GiftCardEventBalance {
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
`;

export const fragmentOrderGrantedRefunds = gql`
  fragment OrderGrantedRefund on OrderGrantedRefund {
    id
    createdAt
    shippingCostsIncluded
    status
    amount {
      currency
      amount
    }
    transactionEvents {
      id
    }
    reason
    reasonReference {
      id
      title
    }
    user {
      ...UserBaseAvatar
    }
    app {
      id
      name
      brand {
        logo {
          default(format: WEBP, size: 64)
        }
      }
    }
    lines {
      id
      quantity
      orderLine {
        id
      }
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
    unitPrice {
      gross {
        ...Money
      }
    }
  }
`;

export const orderDetailsGrantedRefund = gql`
  fragment OrderDetailsGrantedRefund on OrderGrantedRefund {
    id
    reason
    reasonReference {
      id
      title
    }
    amount {
      ...Money
    }
    shippingCostsIncluded
    transaction {
      id
    }
    status
    lines {
      id
      quantity
      reason
      orderLine {
        ...OrderLine
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
    grantedRefunds {
      ...OrderDetailsGrantedRefund
    }
    transactions {
      ...TransactionItem
    }
  }
`;

export const fragmentActivities = gql`
  fragment Activities on OrderEvent {
    date
    email
    message
    orderNumber
    type
    user {
      email
    }
  }
`;
