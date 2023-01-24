import { gql } from "@apollo/client";

export const orderDetailsWithTransactionsQuery = gql`
  query OrderDetailsWithTransactions($id: ID!) {
    order(id: $id) {
      ...OrderDetailsWithTransactions
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
      grantedRefunds {
        id
        reason
        amount {
          ...Money
        }
      }
    }
  }
`;
