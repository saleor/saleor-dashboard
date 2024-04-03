import { gql } from "@apollo/client";

export const orderListQuery = gql`
  query OrderList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: OrderFilterInput
    $sort: OrderSortingInput
  ) {
    orders(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          __typename
          billingAddress {
            ...Address
          }
          created
          id
          number
          paymentStatus
          status
          total {
            __typename
            gross {
              __typename
              amount
              currency
            }
          }
          userEmail
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
export const orderDraftListQuery = gql`
  query OrderDraftList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: OrderDraftFilterInput
    $sort: OrderSortingInput
  ) {
    draftOrders(
      before: $before
      after: $after
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          __typename
          billingAddress {
            ...Address
          }
          created
          id
          number
          paymentStatus
          status
          total {
            __typename
            gross {
              __typename
              amount
              currency
            }
          }
          userEmail
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const orderDetailsQuery = gql`
  query OrderDetails($id: ID!) {
    order(id: $id) {
      ...OrderDetails
    }
    shop {
      countries {
        code
        country
      }
      defaultWeightUnit
      fulfillmentAllowUnpaid
      fulfillmentAutoApprove
      availablePaymentGateways {
        ...PaymentGateway
      }
    }
  }
`;

export const orderDetailsWithMetadataQuery = gql`
  query OrderDetailsWithMetadata($id: ID!, $isStaffUser: Boolean!) {
    order(id: $id) {
      ...OrderDetailsWithMetadata
    }
    shop {
      countries {
        code
        country
      }
      defaultWeightUnit
      fulfillmentAllowUnpaid
      fulfillmentAutoApprove
      availablePaymentGateways {
        ...PaymentGateway
      }
    }
  }
`;

export const orderDetailsGrantedRefund = gql`
  query OrderDetailsGrantRefund($id: ID!) {
    order(id: $id) {
      ...OrderDetailsGrantRefund
    }
  }
`;

export const orderDetailsGrantedRefundEdit = gql`
  query OrderDetailsGrantRefundEdit($id: ID!) {
    order(id: $id) {
      ...OrderDetailsGrantRefund
    }
  }
`;

export const orderFulfillData = gql`
  query OrderFulfillData($orderId: ID!) {
    order(id: $orderId) {
      id
      isPaid
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
      lines {
        ...OrderFulfillLine
      }
      number
    }
  }
`;

export const orderFulfillSettingsQuery = gql`
  query OrderFulfillSettings {
    shop {
      ...ShopOrderSettings
    }
  }
`;

export const orderSettingsQuery = gql`
  query OrderSettings {
    orderSettings {
      ...OrderSettings
    }
    shop {
      ...ShopOrderSettings
    }
  }
`;
export const orderRefundData = gql`
  query OrderRefundData($orderId: ID!) {
    order(id: $orderId) {
      id
      number
      total {
        gross {
          ...Money
        }
      }
      totalCaptured {
        ...Money
      }
      shippingPrice {
        gross {
          ...Money
        }
      }
      lines {
        ...RefundOrderLine
        quantityToFulfill
      }
      fulfillments {
        id
        status
        fulfillmentOrder
        lines {
          id
          quantity
          orderLine {
            ...RefundOrderLine
          }
        }
      }
    }
  }
`;

export const orderTransationsData = gql`
  query OrderTransationsData($orderId: ID!) {
    order(id: $orderId) {
      id
      transactions {
        ...TransactionItem
      }
      total {
        gross {
          ...Money
        }
      }
    }
  }
`;

export const channelUsabilityData = gql`
  query ChannelUsabilityData($channel: String!) {
    products(channel: $channel) {
      totalCount
    }
  }
`;

export const defaultGraphiQLQuery = /* GraphQL */ `
  query OrderDetailsGraphiQL($id: ID!) {
    order(id: $id) {
      id
      number
      status
      isShippingRequired
      canFinalize
      created
      customerNote
      paymentStatus
      userEmail
      isPaid
    }
  }
`;

export const DevModeQuery = /* GraphQL */ `
  query DevModeRun($filter: OrderFilterInput, $sortBy: OrderSortingInput) {
    orders(first: 10, filter: $filter, sortBy: $sortBy) {
      edges {
        node {
          id
          number
          status
          isShippingRequired
          canFinalize
          created
          customerNote
          paymentStatus
          userEmail
          isPaid
        }
      }
    }
  }
`;
