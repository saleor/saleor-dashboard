import { gql } from "@apollo/client";

export const orderCancelMutation = gql`
  mutation OrderCancel($id: ID!, $isStaffUser: Boolean!) {
    orderCancel(id: $id) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

// Discounts
export const orderDiscountAddMutation = gql`
  mutation OrderDiscountAdd(
    $input: OrderDiscountCommonInput!
    $orderId: ID!
    $isStaffUser: Boolean!
  ) {
    orderDiscountAdd(input: $input, orderId: $orderId) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderDiscountDeleteMutation = gql`
  mutation OrderDiscountDelete($discountId: ID!, $isStaffUser: Boolean!) {
    orderDiscountDelete(discountId: $discountId) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderLineDiscountRemoveMutation = gql`
  mutation OrderLineDiscountRemove($orderLineId: ID!, $isStaffUser: Boolean!) {
    orderLineDiscountRemove(orderLineId: $orderLineId) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderLineDiscountUpdateMutation = gql`
  mutation OrderLineDiscountUpdate(
    $input: OrderDiscountCommonInput!
    $orderLineId: ID!
    $isStaffUser: Boolean!
  ) {
    orderLineDiscountUpdate(input: $input, orderLineId: $orderLineId) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderDiscountUpdateMutation = gql`
  mutation OrderDiscountUpdate(
    $input: OrderDiscountCommonInput!
    $discountId: ID!
    $isStaffUser: Boolean!
  ) {
    orderDiscountUpdate(input: $input, discountId: $discountId) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

// -----

export const orderDraftCancelMutation = gql`
  mutation OrderDraftCancel($id: ID!, $isStaffUser: Boolean!) {
    draftOrderDelete(id: $id) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderDraftBulkCancelMutation = gql`
  mutation OrderDraftBulkCancel($ids: [ID!]!) {
    draftOrderBulkDelete(ids: $ids) {
      errors {
        ...OrderError
      }
    }
  }
`;

export const orderConfirmMutation = gql`
  mutation OrderConfirm($id: ID!, $isStaffUser: Boolean!) {
    orderConfirm(id: $id) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderDraftFinalizeMutation = gql`
  mutation OrderDraftFinalize($id: ID!, $isStaffUser: Boolean!) {
    draftOrderComplete(id: $id) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderReturnCreateMutation = gql`
  mutation FulfillmentReturnProducts(
    $id: ID!
    $input: OrderReturnProductsInput!
  ) {
    orderFulfillmentReturnProducts(input: $input, order: $id) {
      errors {
        ...OrderError
      }
      order {
        id
      }
      replaceOrder {
        id
      }
    }
  }
`;

export const orderRefundMutation = gql`
  mutation OrderRefund(
    $id: ID!
    $amount: PositiveDecimal!
    $isStaffUser: Boolean!
  ) {
    orderRefund(id: $id, amount: $amount) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderFulfillmentRefundProductsMutation = gql`
  mutation OrderFulfillmentRefundProducts(
    $input: OrderRefundProductsInput!
    $order: ID!
    $isStaffUser: Boolean!
  ) {
    orderFulfillmentRefundProducts(input: $input, order: $order) {
      errors {
        ...OrderError
      }
      fulfillment {
        ...Fulfillment
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderVoidMutation = gql`
  mutation OrderVoid($id: ID!, $isStaffUser: Boolean!) {
    orderVoid(id: $id) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderMarkAsPaidMutation = gql`
  mutation OrderMarkAsPaid(
    $id: ID!
    $transactionReference: String
    $isStaffUser: Boolean!
  ) {
    orderMarkAsPaid(id: $id, transactionReference: $transactionReference) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderCaptureMutation = gql`
  mutation OrderCapture(
    $id: ID!
    $amount: PositiveDecimal!
    $isStaffUser: Boolean!
  ) {
    orderCapture(id: $id, amount: $amount) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderFulfillmentUpdateTrackingMutation = gql`
  mutation OrderFulfillmentUpdateTracking(
    $id: ID!
    $input: FulfillmentUpdateTrackingInput!
    $isStaffUser: Boolean!
  ) {
    orderFulfillmentUpdateTracking(id: $id, input: $input) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderFulfillmentApproveMutation = gql`
  mutation OrderFulfillmentApprove(
    $id: ID!
    $notifyCustomer: Boolean!
    $allowStockToBeExceeded: Boolean
    $isStaffUser: Boolean!
  ) {
    orderFulfillmentApprove(
      id: $id
      notifyCustomer: $notifyCustomer
      allowStockToBeExceeded: $allowStockToBeExceeded
    ) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderFulfillmentCancelMutation = gql`
  mutation OrderFulfillmentCancel(
    $id: ID!
    $input: FulfillmentCancelInput!
    $isStaffUser: Boolean!
  ) {
    orderFulfillmentCancel(id: $id, input: $input) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderAddNoteMutation = gql`
  mutation OrderAddNote($order: ID!, $input: OrderAddNoteInput!) {
    orderAddNote(order: $order, input: $input) {
      errors {
        ...OrderError
      }
      order {
        id
        events {
          ...OrderEvent
        }
      }
    }
  }
`;

export const orderUpdateMutation = gql`
  mutation OrderUpdate(
    $id: ID!
    $input: OrderUpdateInput!
    $isStaffUser: Boolean!
  ) {
    orderUpdate(id: $id, input: $input) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderDraftUpdateMutation = gql`
  mutation OrderDraftUpdate(
    $id: ID!
    $input: DraftOrderInput!
    $isStaffUser: Boolean!
  ) {
    draftOrderUpdate(id: $id, input: $input) {
      errors {
        ...OrderError
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const orderShippingMethodUpdateMutation = gql`
  mutation OrderShippingMethodUpdate(
    $id: ID!
    $input: OrderUpdateShippingInput!
    $isStaffUser: Boolean!
  ) {
    orderUpdateShipping(order: $id, input: $input) {
      errors {
        ...OrderError
      }
      order {
        shippingMethods {
          id
          name
        }
        total {
          tax {
            amount
            currency
          }
          gross {
            amount
            currency
          }
        }
        id
        shippingMethod {
          id
          name
          price {
            amount
            currency
          }
        }
        shippingMethodName
        shippingPrice {
          gross {
            amount
            currency
          }
        }
        ...OrderDetails
      }
    }
  }
`;

export const orderDraftCreateMutation = gql`
  mutation OrderDraftCreate($input: DraftOrderCreateInput!) {
    draftOrderCreate(input: $input) {
      errors {
        ...OrderError
      }
      order {
        id
      }
    }
  }
`;

export const orderLineDeleteMutation = gql`
  mutation OrderLineDelete($id: ID!, $isStaffUser: Boolean!) {
    orderLineDelete(id: $id) {
      errors {
        ...OrderError
      }
      order {
        id
        lines {
          ...OrderLine
        }
      }
    }
  }
`;

export const orderLinesAddMutation = gql`
  mutation OrderLinesAdd(
    $id: ID!
    $isStaffUser: Boolean!
    $input: [OrderLineCreateInput!]!
  ) {
    orderLinesCreate(id: $id, input: $input) {
      errors {
        ...OrderError
      }
      order {
        id
        lines {
          ...OrderLine
        }
      }
    }
  }
`;

export const orderLineUpdateMutation = gql`
  mutation OrderLineUpdate(
    $id: ID!
    $isStaffUser: Boolean!
    $input: OrderLineInput!
  ) {
    orderLineUpdate(id: $id, input: $input) {
      errors {
        ...OrderError
      }
      orderLine {
        ...OrderLine
      }
    }
  }
`;

export const fulfillOrder = gql`
  mutation FulfillOrder(
    $orderId: ID!
    $input: OrderFulfillInput!
    $isStaffUser: Boolean!
  ) {
    orderFulfill(order: $orderId, input: $input) {
      errors {
        ...OrderError
        warehouse
      }
      order {
        ...OrderDetails
      }
    }
  }
`;

export const invoiceRequestMutation = gql`
  mutation InvoiceRequest($orderId: ID!) {
    invoiceRequest(orderId: $orderId) {
      errors {
        ...InvoiceError
      }
      invoice {
        ...Invoice
      }
      order {
        id
        invoices {
          ...Invoice
        }
      }
    }
  }
`;

export const invoiceEmailSendMutation = gql`
  mutation InvoiceEmailSend($id: ID!) {
    invoiceSendNotification(id: $id) {
      errors {
        ...InvoiceError
      }
      invoice {
        ...Invoice
      }
    }
  }
`;

export const orderSettingsUpdateMutation = gql`
  mutation OrderSettingsUpdate(
    $orderSettingsInput: OrderSettingsUpdateInput!
    $shopSettingsInput: ShopSettingsInput!
  ) {
    orderSettingsUpdate(input: $orderSettingsInput) {
      errors {
        ...OrderSettingsError
      }
      orderSettings {
        ...OrderSettings
      }
    }
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors {
        ...ShopError
      }
      shop {
        ...ShopOrderSettings
      }
    }
  }
`;

// Transactions

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
        name: "Manual capture"
        pspReference: $pspReference
        amountCharged: { amount: $amount, currency: $currency }
      }
      transactionEvent: { pspReference: $pspReference, message: $description }
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
        name: "Manual refund"
        pspReference: $pspReference
        amountRefunded: { amount: $amount, currency: $currency }
      }
      transactionEvent: { pspReference: $pspReference, message: $description }
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
