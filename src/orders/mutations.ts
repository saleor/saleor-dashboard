import gql from "graphql-tag";

import makeMutation from "@saleor/hooks/makeMutation";
import { TypedMutation } from "../mutations";
import {
  fragmentAddress,
  fragmentOrderDetails,
  fragmentOrderEvent
} from "./queries";
import { OrderAddNote, OrderAddNoteVariables } from "./types/OrderAddNote";
import {
  OrderBulkCancel,
  OrderBulkCancelVariables
} from "./types/OrderBulkCancel";
import { OrderCancel, OrderCancelVariables } from "./types/OrderCancel";
import { OrderCapture, OrderCaptureVariables } from "./types/OrderCapture";
import {
  OrderCreateFulfillment,
  OrderCreateFulfillmentVariables
} from "./types/OrderCreateFulfillment";
import {
  OrderDraftBulkCancel,
  OrderDraftBulkCancelVariables
} from "./types/OrderDraftBulkCancel";
import {
  OrderDraftCancel,
  OrderDraftCancelVariables
} from "./types/OrderDraftCancel";
import { OrderDraftCreate } from "./types/OrderDraftCreate";
import {
  OrderDraftFinalize,
  OrderDraftFinalizeVariables
} from "./types/OrderDraftFinalize";
import {
  OrderDraftUpdate,
  OrderDraftUpdateVariables
} from "./types/OrderDraftUpdate";
import {
  OrderFulfillmentCancel,
  OrderFulfillmentCancelVariables
} from "./types/OrderFulfillmentCancel";
import {
  OrderFulfillmentUpdateTracking,
  OrderFulfillmentUpdateTrackingVariables
} from "./types/OrderFulfillmentUpdateTracking";
import {
  OrderLineDelete,
  OrderLineDeleteVariables
} from "./types/OrderLineDelete";
import { OrderLinesAdd, OrderLinesAddVariables } from "./types/OrderLinesAdd";
import {
  OrderLineUpdate,
  OrderLineUpdateVariables
} from "./types/OrderLineUpdate";
import {
  OrderMarkAsPaid,
  OrderMarkAsPaidVariables
} from "./types/OrderMarkAsPaid";
import { OrderRefund, OrderRefundVariables } from "./types/OrderRefund";
import {
  OrderShippingMethodUpdate,
  OrderShippingMethodUpdateVariables
} from "./types/OrderShippingMethodUpdate";
import { OrderUpdate, OrderUpdateVariables } from "./types/OrderUpdate";
import { OrderVoid, OrderVoidVariables } from "./types/OrderVoid";

export const orderErrorFragment = gql`
  fragment OrderErrorFragment on OrderError {
    code
    field
  }
`;

const orderCancelMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderCancel($id: ID!, $restock: Boolean!) {
    orderCancel(id: $id, restock: $restock) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderCancelMutation = TypedMutation<
  OrderCancel,
  OrderCancelVariables
>(orderCancelMutation);

const orderBulkCancelMutation = gql`
  ${orderErrorFragment}
  mutation OrderBulkCancel($ids: [ID]!, $restock: Boolean!) {
    orderBulkCancel(ids: $ids, restock: $restock) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
    }
  }
`;
export const TypedOrderBulkCancelMutation = TypedMutation<
  OrderBulkCancel,
  OrderBulkCancelVariables
>(orderBulkCancelMutation);

const orderDraftCancelMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderDraftCancel($id: ID!) {
    draftOrderDelete(id: $id) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderDraftCancelMutation = TypedMutation<
  OrderDraftCancel,
  OrderDraftCancelVariables
>(orderDraftCancelMutation);

const orderDraftBulkCancelMutation = gql`
  ${orderErrorFragment}
  mutation OrderDraftBulkCancel($ids: [ID]!) {
    draftOrderBulkDelete(ids: $ids) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
    }
  }
`;
export const TypedOrderDraftBulkCancelMutation = TypedMutation<
  OrderDraftBulkCancel,
  OrderDraftBulkCancelVariables
>(orderDraftBulkCancelMutation);

const orderDraftFinalizeMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderDraftFinalize($id: ID!) {
    draftOrderComplete(id: $id) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderDraftFinalizeMutation = TypedMutation<
  OrderDraftFinalize,
  OrderDraftFinalizeVariables
>(orderDraftFinalizeMutation);

const orderRefundMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderRefund($id: ID!, $amount: Decimal!) {
    orderRefund(id: $id, amount: $amount) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderRefundMutation = TypedMutation<
  OrderRefund,
  OrderRefundVariables
>(orderRefundMutation);

const orderVoidMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderVoid($id: ID!) {
    orderVoid(id: $id) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderVoidMutation = TypedMutation<
  OrderVoid,
  OrderVoidVariables
>(orderVoidMutation);

const orderMarkAsPaidMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderMarkAsPaid($id: ID!) {
    orderMarkAsPaid(id: $id) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderMarkAsPaidMutation = TypedMutation<
  OrderMarkAsPaid,
  OrderMarkAsPaidVariables
>(orderMarkAsPaidMutation);

const orderCaptureMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderCapture($id: ID!, $amount: Decimal!) {
    orderCapture(id: $id, amount: $amount) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderCaptureMutation = TypedMutation<
  OrderCapture,
  OrderCaptureVariables
>(orderCaptureMutation);

const orderCreateFulfillmentMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderCreateFulfillment(
    $order: ID!
    $input: FulfillmentCreateInput!
  ) {
    orderFulfillmentCreate(order: $order, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderCreateFulfillmentMutation = TypedMutation<
  OrderCreateFulfillment,
  OrderCreateFulfillmentVariables
>(orderCreateFulfillmentMutation);

const orderFulfillmentUpdateTrackingMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderFulfillmentUpdateTracking(
    $id: ID!
    $input: FulfillmentUpdateTrackingInput!
  ) {
    orderFulfillmentUpdateTracking(id: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderFulfillmentUpdateTrackingMutation = TypedMutation<
  OrderFulfillmentUpdateTracking,
  OrderFulfillmentUpdateTrackingVariables
>(orderFulfillmentUpdateTrackingMutation);

const orderFulfillmentCancelMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderFulfillmentCancel($id: ID!, $input: FulfillmentCancelInput!) {
    orderFulfillmentCancel(id: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderFulfillmentCancelMutation = TypedMutation<
  OrderFulfillmentCancel,
  OrderFulfillmentCancelVariables
>(orderFulfillmentCancelMutation);

const orderAddNoteMutation = gql`
  ${fragmentOrderEvent}
  ${orderErrorFragment}
  mutation OrderAddNote($order: ID!, $input: OrderAddNoteInput!) {
    orderAddNote(order: $order, input: $input) {
      errors: orderErrors {
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
export const TypedOrderAddNoteMutation = TypedMutation<
  OrderAddNote,
  OrderAddNoteVariables
>(orderAddNoteMutation);

const orderUpdateMutation = gql`
  ${fragmentAddress}
  ${orderErrorFragment}
  mutation OrderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        id
        userEmail
        billingAddress {
          ...AddressFragment
        }
        shippingAddress {
          ...AddressFragment
        }
      }
    }
  }
`;
export const TypedOrderUpdateMutation = TypedMutation<
  OrderUpdate,
  OrderUpdateVariables
>(orderUpdateMutation);

const orderDraftUpdateMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderDraftUpdate($id: ID!, $input: DraftOrderInput!) {
    draftOrderUpdate(id: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderDraftUpdateMutation = TypedMutation<
  OrderDraftUpdate,
  OrderDraftUpdateVariables
>(orderDraftUpdateMutation);

const orderShippingMethodUpdateMutation = gql`
  ${orderErrorFragment}
  mutation OrderShippingMethodUpdate(
    $id: ID!
    $input: OrderUpdateShippingInput!
  ) {
    orderUpdateShipping(order: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        availableShippingMethods {
          id
          name
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
      }
    }
  }
`;
export const TypedOrderShippingMethodUpdateMutation = TypedMutation<
  OrderShippingMethodUpdate,
  OrderShippingMethodUpdateVariables
>(orderShippingMethodUpdateMutation);

const orderDraftCreateMutation = gql`
  ${orderErrorFragment}
  mutation OrderDraftCreate {
    draftOrderCreate(input: {}) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        id
      }
    }
  }
`;
export const useOrderDraftCreateMutation = makeMutation<OrderDraftCreate, {}>(
  orderDraftCreateMutation
);

const orderLineDeleteMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderLineDelete($id: ID!) {
    draftOrderLineDelete(id: $id) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderLineDeleteMutation = TypedMutation<
  OrderLineDelete,
  OrderLineDeleteVariables
>(orderLineDeleteMutation);

const orderLinesAddMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderLinesAdd($id: ID!, $input: [OrderLineCreateInput]!) {
    draftOrderLinesCreate(id: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderLinesAddMutation = TypedMutation<
  OrderLinesAdd,
  OrderLinesAddVariables
>(orderLinesAddMutation);

const orderLineUpdateMutation = gql`
  ${fragmentOrderDetails}
  ${orderErrorFragment}
  mutation OrderLineUpdate($id: ID!, $input: OrderLineInput!) {
    draftOrderLineUpdate(id: $id, input: $input) {
      errors: orderErrors {
        ...OrderErrorFragment
      }
      order {
        ...OrderDetailsFragment
      }
    }
  }
`;
export const TypedOrderLineUpdateMutation = TypedMutation<
  OrderLineUpdate,
  OrderLineUpdateVariables
>(orderLineUpdateMutation);
