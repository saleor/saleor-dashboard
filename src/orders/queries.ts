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

export const channelUsabilityData = gql`
  query ChannelUsabilityData($channel: String!) {
    products(channel: $channel) {
      totalCount
    }
  }
`;
