import { gql } from "@apollo/client";

export const singleOrderQuery = gql`
  query SingleOrder($id: ID!, $hasManageProducts: Boolean!) {
    order(id: $id) {
      id
      token
      ... on ObjectWithMetadata {
        metadata {
          key
          value
        }
        privateMetadata {
          key
          value
        }
      }
      billingAddress {
        city
        cityArea
        companyName
        country {
          code
          country
        }
        countryArea
        firstName
        id
        lastName
        phone
        postalCode
        streetAddress1
        streetAddress2
      }
      transactions {
        id
        name
        actions
        events {
          id
          pspReference
          amount {
            amount
            currency
          }
          externalUrl
          type
          message
          createdAt
          createdBy {
            ... on User {
              id
              email
              firstName
              isActive
              lastName
              avatar(size: 512) {
                url
              }
            }
            ... on App {
              id
              name
            }
          }
        }
        pspReference
        externalUrl
        createdAt
        authorizedAmount {
          amount
          currency
        }
        chargedAmount {
          amount
          currency
        }
        refundedAmount {
          amount
          currency
        }
        canceledAmount {
          amount
          currency
        }
        authorizePendingAmount {
          amount
          currency
        }
        chargePendingAmount {
          amount
          currency
        }
        refundPendingAmount {
          amount
          currency
        }
        cancelPendingAmount {
          amount
          currency
        }
      }
      payments {
        id
        isActive
        actions
        gateway
        paymentMethodType
        availableCaptureAmount {
          amount
          currency
        }
        capturedAmount {
          amount
          currency
        }
        total {
          amount
          currency
        }
        availableRefundAmount {
          amount
          currency
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
      giftCards {
        id
        last4CodeChars
        events {
          id
          type
          orderId
          date
          balance {
            initialBalance {
              amount
              currency
            }
            currentBalance {
              amount
              currency
            }
            oldInitialBalance {
              amount
              currency
            }
            oldCurrentBalance {
              amount
              currency
            }
          }
        }
      }
      grantedRefunds {
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
        user {
          id
          firstName
          lastName
          email
          avatar {
            url
            alt
          }
        }
        app {
          id
          name
        }
        lines {
          id
          quantity
          orderLine {
            id
          }
        }
      }
      isShippingRequired
      canFinalize
      created
      customerNote
      discounts {
        id
        type
        name
        calculationMode: valueType
        value
        reason
        amount {
          amount
          currency
        }
      }
      events {
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
      fulfillments {
        ... on ObjectWithMetadata {
          metadata {
            key
            value
          }
          privateMetadata {
            key
            value
          }
        }
        id
        lines {
          id
          quantity
          orderLine {
            id
          }
        }
        fulfillmentOrder
        status
        trackingNumber
        warehouse {
          id
          name
        }
        ... on ObjectWithMetadata {
          metadata {
            key
            value
          }
          privateMetadata {
            key
            value
          }
        }
      }
      lines {
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
          product {
            id
            isAvailableForPurchase
          }
          metadata {
            key
            value
          }
          privateMetadata @include(if: $hasManageProducts) {
            key
            value
          }
        }
        productName
        productSku
        isGift
        quantity
        quantityFulfilled
        quantityToFulfill
        totalPrice {
          net {
            amount
            currency
          }
          gross {
            amount
            currency
          }
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
      number
      isPaid
      paymentStatus
      shippingAddress {
        city
        cityArea
        companyName
        country {
          code
          country
        }
        countryArea
        firstName
        id
        lastName
        phone
        postalCode
        streetAddress1
        streetAddress2
      }
      deliveryMethod {
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
          amount
          currency
        }
        net {
          amount
          currency
        }
      }
      total {
        gross {
          amount
          currency
        }
        net {
          amount
          currency
        }
        tax {
          amount
          currency
        }
      }
      totalRemainingGrant {
        amount
        currency
      }
      totalGrantedRefund {
        amount
        currency
      }
      totalRefundPending {
        amount
        currency
      }
      totalRefunded {
        amount
        currency
      }
      actions
      totalAuthorizePending {
        amount
        currency
      }
      totalAuthorized {
        amount
        currency
      }
      totalCaptured {
        amount
        currency
      }
      totalCharged {
        amount
        currency
      }
      totalChargePending {
        amount
        currency
      }
      totalCanceled {
        amount
        currency
      }
      totalCancelPending {
        amount
        currency
      }
      totalBalance {
        amount
        currency
      }
      undiscountedTotal {
        net {
          amount
          currency
        }
        gross {
          amount
          currency
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
          amount
          currency
        }
        active
        message
      }
      invoices {
        id
        number
        createdAt
        url
        status
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
    }
  }
`;
