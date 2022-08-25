import { gql } from "@apollo/client";

export const orderCancelMutation = gql`
  mutation OrderCancel($id: ID!) {
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
  mutation OrderDiscountAdd($input: OrderDiscountCommonInput!, $orderId: ID!) {
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
  mutation OrderDiscountDelete($discountId: ID!) {
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
  mutation OrderLineDiscountRemove($orderLineId: ID!) {
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
  mutation OrderDraftCancel($id: ID!) {
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
  mutation OrderConfirm($id: ID!) {
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
  mutation OrderDraftFinalize($id: ID!) {
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
  mutation OrderRefund($id: ID!, $amount: PositiveDecimal!) {
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
  mutation OrderVoid($id: ID!) {
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
  mutation OrderMarkAsPaid($id: ID!, $transactionReference: String) {
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
  mutation OrderCapture($id: ID!, $amount: PositiveDecimal!) {
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
  mutation OrderFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
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
  mutation OrderUpdate($id: ID!, $input: OrderUpdateInput!) {
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
  mutation OrderDraftUpdate($id: ID!, $input: DraftOrderInput!) {
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
  mutation OrderLineDelete($id: ID!) {
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
  mutation OrderLinesAdd($id: ID!, $input: [OrderLineCreateInput!]!) {
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
  mutation OrderLineUpdate($id: ID!, $input: OrderLineInput!) {
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
  mutation FulfillOrder($orderId: ID!, $input: OrderFulfillInput!) {
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
