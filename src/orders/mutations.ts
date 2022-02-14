import { gql } from "@apollo/client";

export const orderCancelMutation = gql`
  mutation OrderCancel($id: ID!) {
    orderCancel(id: $id) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

// Discounts
export const orderDiscountAddMutation = gql`
  mutation OrderDiscountAdd($input: OrderDiscountCommonInput!, $orderId: ID!) {
    orderDiscountAdd(input: $input, orderId: $orderId) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderDiscountDeleteMutation = gql`
  mutation OrderDiscountDelete($discountId: ID!) {
    orderDiscountDelete(discountId: $discountId) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderLineDiscountRemoveMutation = gql`
  mutation OrderLineDiscountRemove($orderLineId: ID!) {
    orderLineDiscountRemove(orderLineId: $orderLineId) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
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
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
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
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

// -----

export const orderDraftCancelMutation = gql`
  mutation OrderDraftCancel($id: ID!) {
    draftOrderDelete(id: $id) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderDraftBulkCancelMutation = gql`
  mutation OrderDraftBulkCancel($ids: [ID]!) {
    draftOrderBulkDelete(ids: $ids) {
      errors {
        ...OrderErrorFragment
      }
    }
  }
`;

export const orderConfirmMutation = gql`
  mutation OrderConfirm($id: ID!) {
    orderConfirm(id: $id) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderDraftFinalizeMutation = gql`
  mutation OrderDraftFinalize($id: ID!) {
    draftOrderComplete(id: $id) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
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
        ...OrderErrorFragment
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
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
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
        ...OrderErrorFragment
      }
      fulfillment {
        ...FulfillmentFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderVoidMutation = gql`
  mutation OrderVoid($id: ID!) {
    orderVoid(id: $id) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderMarkAsPaidMutation = gql`
  mutation OrderMarkAsPaid($id: ID!, $transactionReference: String) {
    orderMarkAsPaid(id: $id, transactionReference: $transactionReference) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderCaptureMutation = gql`
  mutation OrderCapture($id: ID!, $amount: PositiveDecimal!) {
    orderCapture(id: $id, amount: $amount) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
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
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderFulfillmentApproveMutation = gql`
  mutation OrderFulfillmentApprove($id: ID!, $notifyCustomer: Boolean!) {
    orderFulfillmentApprove(id: $id, notifyCustomer: $notifyCustomer) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderFulfillmentCancelMutation = gql`
  mutation OrderFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
    orderFulfillmentCancel(id: $id, input: $input) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderAddNoteMutation = gql`
  mutation OrderAddNote($order: ID!, $input: OrderAddNoteInput!) {
    orderAddNote(order: $order, input: $input) {
      errors {
        ...OrderErrorFragment
      }
      order {
        id
        events {
          ...OrderEventFragment
        }
      }
    }
  }
`;

export const orderUpdateMutation = gql`
  mutation OrderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderDraftUpdateMutation = gql`
  mutation OrderDraftUpdate($id: ID!, $input: DraftOrderInput!) {
    draftOrderUpdate(id: $id, input: $input) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
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
        ...OrderErrorFragment
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
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderDraftCreateMutation = gql`
  mutation OrderDraftCreate($input: DraftOrderCreateInput!) {
    draftOrderCreate(input: $input) {
      errors {
        ...OrderErrorFragment
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
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderLinesAddMutation = gql`
  mutation OrderLinesAdd($id: ID!, $input: [OrderLineCreateInput]!) {
    orderLinesCreate(id: $id, input: $input) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const orderLineUpdateMutation = gql`
  mutation OrderLineUpdate($id: ID!, $input: OrderLineInput!) {
    orderLineUpdate(id: $id, input: $input) {
      errors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const fulfillOrder = gql`
  mutation FulfillOrder($orderId: ID!, $input: OrderFulfillInput!) {
    orderFulfill(order: $orderId, input: $input) {
      errors {
        ...OrderErrorFragment
        warehouse
        orderLines
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;

export const invoiceRequestMutation = gql`
  mutation InvoiceRequest($orderId: ID!) {
    invoiceRequest(orderId: $orderId) {
      errors {
        ...InvoiceErrorFragment
      }
      invoice {
        ...InvoiceFragment
      }
      order {
        id
        invoices {
          ...InvoiceFragment
        }
      }
    }
  }
`;

export const invoiceEmailSendMutation = gql`
  mutation InvoiceEmailSend($id: ID!) {
    invoiceSendNotification(id: $id) {
      errors {
        ...InvoiceErrorFragment
      }
      invoice {
        ...InvoiceFragment
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
        ...OrderSettingsErrorFragment
      }
      orderSettings {
        ...OrderSettingsFragment
      }
    }
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors {
        ...ShopErrorFragment
      }
      shop {
        ...ShopOrderSettingsFragment
      }
    }
  }
`;
