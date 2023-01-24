import { gql } from "@apollo/client";

export const orderTransactionRequestActionMutation = gql`
  mutation OrderTransactionRequestAction(
    $action: TransactionActionEnum!
    $transactionId: ID!
  ) {
    transactionRequestAction(actionType: $action, id: $transactionId) {
      errors {
        ...TransactionRequestActionError
      }
    }
  }
`;

export const orderGrantRefundAddMutation = gql`
  mutation OrderGrantRefundAdd(
    $orderId: ID!
    $amount: Decimal!
    $reason: String
  ) {
    orderGrantRefundCreate(
      id: $orderId
      input: { amount: $amount, reason: $reason }
    ) {
      errors {
        ...OrderGrantRefundCreateError
      }
    }
  }
`;

export const orderGrantRefundEditMutation = gql`
  mutation OrderGrantRefundEdit(
    $refundId: ID!
    $amount: Decimal!
    $reason: String
  ) {
    orderGrantRefundUpdate(
      id: $refundId
      input: { amount: $amount, reason: $reason }
    ) {
      errors {
        ...OrderGrantRefundUpdateError
      }
    }
  }
`;

export const orderSendRefundMutation = gql`
  mutation OrderSendRefund($amount: PositiveDecimal!, $transactionId: ID!) {
    transactionRequestAction(
      actionType: REFUND
      amount: $amount
      id: $transactionId
    ) {
      transaction {
        ...TransactionItem
      }
      errors {
        ...TransactionRequestActionError
      }
    }
  }
`;

export const createManualTransactionCapture = gql`
  mutation CreateManualTransactionCapture(
    $orderId: ID!
    $amount: PositiveDecimal!
    $currency: String!
    $description: String
    $pspReference: String
  ) {
    transactionCreate(
      id: $orderId
      transaction: {
        type: "Manual capture"
        status: "Success"
        pspReference: $pspReference
        amountCharged: { amount: $amount, currency: $currency }
      }
      transactionEvent: {
        status: SUCCESS
        pspReference: $pspReference
        name: $description
      }
    ) {
      transaction {
        ...TransactionItem
      }
      errors {
        ...TransactionCreateError
      }
    }
  }
`;

export const createManualTransactionRefund = gql`
  mutation CreateManualTransactionRefund(
    $orderId: ID!
    $amount: PositiveDecimal!
    $currency: String!
    $description: String
    $pspReference: String
  ) {
    transactionCreate(
      id: $orderId
      transaction: {
        type: "Manual refund"
        status: "Success"
        pspReference: $pspReference
        amountRefunded: { amount: $amount, currency: $currency }
      }
      transactionEvent: {
        status: SUCCESS
        pspReference: $pspReference
        name: $description
      }
    ) {
      transaction {
        ...TransactionItem
      }
      errors {
        ...TransactionCreateError
      }
    }
  }
`;
