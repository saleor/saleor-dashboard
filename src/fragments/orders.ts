import gql from "graphql-tag";

import { fragmentAddress } from "./address";
import { metadataFragment } from "./metadata";

export const fragmentOrderEvent = gql`
  fragment OrderEventFragment on OrderEvent {
    id
    amount
    shippingCostsIncluded
    date
    email
    emailType
    invoiceNumber
    message
    quantity
    transactionReference
    type
    user {
      id
      email
    }
    lines {
      quantity
      orderLine {
        id
        productName
        variantName
      }
    }
  }
`;

export const fragmentOrderLine = gql`
  fragment OrderLineFragment on OrderLine {
    id
    isShippingRequired
    variant {
      id
      quantityAvailable
    }
    productName
    productSku
    quantity
    quantityFulfilled
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

export const fragmentRefundOrderLine = gql`
  fragment RefundOrderLineFragment on OrderLine {
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
  ${fragmentOrderLine}
  fragment FulfillmentFragment on Fulfillment {
    id
    lines {
      id
      quantity
      orderLine {
        ...OrderLineFragment
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

export const invoiceFragment = gql`
  fragment InvoiceFragment on Invoice {
    id
    number
    createdAt
    url
    status
  }
`;

export const fragmentOrderDetails = gql`
  ${fragmentAddress}
  ${fragmentOrderEvent}
  ${fragmentOrderLine}
  ${fulfillmentFragment}
  ${invoiceFragment}
  ${metadataFragment}
  fragment OrderDetailsFragment on Order {
    id
    ...MetadataFragment
    billingAddress {
      ...AddressFragment
    }
    canFinalize
    created
    customerNote
    events {
      ...OrderEventFragment
    }
    fulfillments {
      ...FulfillmentFragment
    }
    lines {
      ...OrderLineFragment
    }
    number
    paymentStatus
    shippingAddress {
      ...AddressFragment
    }
    shippingMethod {
      id
    }
    shippingMethodName
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
    }
    total {
      gross {
        amount
        currency
      }
      tax {
        amount
        currency
      }
    }
    actions
    totalAuthorized {
      amount
      currency
    }
    totalCaptured {
      amount
      currency
    }
    user {
      id
      email
    }
    userEmail
    availableShippingMethods {
      id
      name
      price {
        amount
        currency
      }
    }
    discount {
      amount
      currency
    }
    invoices {
      ...InvoiceFragment
    }
    channel {
      isActive
      id
      name
      currencyCode
    }
    isPaid
  }
`;

export const fragmentOrderSettings = gql`
  fragment OrderSettingsFragment on OrderSettings {
    automaticallyConfirmAllNewOrders
  }
`;
