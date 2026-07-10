import {
  FulfillmentStatus,
  type OrderDetailsFragment,
  type OrderEventFragment,
  OrderEventsEnum,
  type OrderLineFragment,
} from "@dashboard/graphql";

export type LineShipmentEntry = {
  fulfillmentId: string;
  fulfillmentOrder: number;
  displayId: string;
  status: FulfillmentStatus;
  quantity: number;
  warehouse?: { id: string; name: string };
  restockWarehouse?: { id: string; name: string };
  trackingNumber?: string;
  created: string;
};

export type OrderLineLifecycle = {
  orderLineId: string;
  orderLine: OrderLineFragment;
  ordered: number;
  allocated: number;
  toFulfill: number;
  shipped: number;
  pendingApproval: number;
  returned: number;
  refundedFulfillment: number;
  replaced: number;
  grantedRefund: number;
  shipments: LineShipmentEntry[];
};

const RETURNED_STATUSES = new Set<FulfillmentStatus>([
  FulfillmentStatus.RETURNED,
  FulfillmentStatus.REFUNDED_AND_RETURNED,
]);

const REFUNDED_STATUSES = new Set<FulfillmentStatus>([
  FulfillmentStatus.REFUNDED,
  FulfillmentStatus.REFUNDED_AND_RETURNED,
]);

const addQuantityToStatusBucket = (
  status: FulfillmentStatus,
  quantity: number,
  buckets: Pick<
    OrderLineLifecycle,
    "shipped" | "pendingApproval" | "returned" | "refundedFulfillment" | "replaced"
  >,
) => {
  switch (status) {
    case FulfillmentStatus.FULFILLED:
      buckets.shipped += quantity;
      break;
    case FulfillmentStatus.WAITING_FOR_APPROVAL:
      buckets.pendingApproval += quantity;
      break;
    case FulfillmentStatus.RETURNED:
    case FulfillmentStatus.REFUNDED_AND_RETURNED:
      buckets.returned += quantity;
      break;
    case FulfillmentStatus.REFUNDED:
      buckets.refundedFulfillment += quantity;
      break;
    case FulfillmentStatus.REPLACED:
      buckets.replaced += quantity;
      break;
    case FulfillmentStatus.CANCELED:
      break;
    default:
      break;
  }

  if (RETURNED_STATUSES.has(status) && REFUNDED_STATUSES.has(status)) {
    buckets.refundedFulfillment += quantity;
  }
};

const getAllocatedQuantity = (line: OrderLineFragment): number =>
  line.allocations?.reduce((sum, allocation) => sum + allocation.quantity, 0) ?? 0;

const getGrantedRefundQuantity = (
  orderLineId: string,
  grantedRefunds: OrderDetailsFragment["grantedRefunds"],
): number =>
  grantedRefunds?.reduce((sum, grantedRefund) => {
    const lineQuantity =
      grantedRefund.lines?.reduce((lineSum, grantedLine) => {
        if (grantedLine.orderLine?.id !== orderLineId) {
          return lineSum;
        }

        return lineSum + grantedLine.quantity;
      }, 0) ?? 0;

    return sum + lineQuantity;
  }, 0) ?? 0;

const getFulfillmentComposedId = (orderNumber: string, fulfillmentOrder: number): string =>
  `${orderNumber}-${fulfillmentOrder}`;

export type FulfillmentWarehouseDisplay = {
  sourceWarehouse?: { id: string; name: string };
  restockWarehouse?: { id: string; name: string };
};

export const getFulfillmentWarehouseDisplay = (
  order: Pick<OrderDetailsFragment, "number" | "events">,
  fulfillment: {
    status: FulfillmentStatus;
    fulfillmentOrder: number;
    warehouse?: { id: string; name: string } | null;
  },
  restockWarehouseByComposedId?: Map<string, { id: string; name: string }>,
): FulfillmentWarehouseDisplay => {
  const restockMap =
    restockWarehouseByComposedId ?? buildFulfillmentRestockWarehouseMap(order.events);
  const sourceWarehouse = fulfillment.warehouse ?? undefined;
  const restockWarehouse =
    fulfillment.status === FulfillmentStatus.CANCELED
      ? restockMap.get(getFulfillmentComposedId(order.number, fulfillment.fulfillmentOrder))
      : undefined;
  const showSourceWarehouse =
    sourceWarehouse &&
    (fulfillment.status !== FulfillmentStatus.CANCELED ||
      !restockWarehouse ||
      sourceWarehouse.id !== restockWarehouse.id);

  return {
    sourceWarehouse: showSourceWarehouse ? sourceWarehouse : undefined,
    restockWarehouse,
  };
};

const findRestockEventForCancel = (
  events: OrderEventFragment[],
  cancelIndex: number,
): OrderEventFragment | undefined => {
  for (let index = cancelIndex + 1; index < events.length; index++) {
    const event = events[index];

    if (event.type === OrderEventsEnum.FULFILLMENT_CANCELED) {
      return undefined;
    }

    if (event.type === OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS && event.warehouse) {
      return event;
    }
  }

  return undefined;
};

export const buildFulfillmentRestockWarehouseMap = (
  events: OrderEventFragment[] | null | undefined,
): Map<string, { id: string; name: string }> => {
  const restockWarehouseByComposedId = new Map<string, { id: string; name: string }>();

  events?.forEach((event, index) => {
    if (event.type !== OrderEventsEnum.FULFILLMENT_CANCELED || !event.composedId) {
      return;
    }

    const restockEvent = findRestockEventForCancel(events, index);

    if (!restockEvent?.warehouse) {
      return;
    }

    restockWarehouseByComposedId.set(event.composedId, {
      id: restockEvent.warehouse.id,
      name: restockEvent.warehouse.name,
    });
  });

  return restockWarehouseByComposedId;
};

const buildLineLifecycle = (
  line: OrderLineFragment,
  order: OrderDetailsFragment,
  restockWarehouseByComposedId: Map<string, { id: string; name: string }>,
): OrderLineLifecycle => {
  const buckets = {
    shipped: 0,
    pendingApproval: 0,
    returned: 0,
    refundedFulfillment: 0,
    replaced: 0,
  };
  const shipments: LineShipmentEntry[] = [];

  order.fulfillments?.forEach(fulfillment => {
    fulfillment.lines?.forEach(fulfillmentLine => {
      if (fulfillmentLine.orderLine?.id !== line.id) {
        return;
      }

      const quantity = fulfillmentLine.quantity;
      const composedId = getFulfillmentComposedId(order.number, fulfillment.fulfillmentOrder);
      const { sourceWarehouse, restockWarehouse } = getFulfillmentWarehouseDisplay(
        order,
        fulfillment,
        restockWarehouseByComposedId,
      );

      shipments.push({
        fulfillmentId: fulfillment.id,
        fulfillmentOrder: fulfillment.fulfillmentOrder,
        displayId: `#${composedId}`,
        status: fulfillment.status,
        quantity,
        warehouse: sourceWarehouse,
        restockWarehouse,
        trackingNumber: fulfillment.trackingNumber || undefined,
        created: fulfillment.created,
      });

      if (fulfillment.status !== FulfillmentStatus.CANCELED) {
        addQuantityToStatusBucket(fulfillment.status, quantity, buckets);
      }
    });
  });

  shipments.sort((a, b) => a.fulfillmentOrder - b.fulfillmentOrder);

  return {
    orderLineId: line.id,
    orderLine: line,
    ordered: line.quantity,
    allocated: getAllocatedQuantity(line),
    toFulfill: line.quantityToFulfill,
    shipped: buckets.shipped,
    pendingApproval: buckets.pendingApproval,
    returned: buckets.returned,
    refundedFulfillment: buckets.refundedFulfillment,
    replaced: buckets.replaced,
    grantedRefund: getGrantedRefundQuantity(line.id, order.grantedRefunds),
    shipments,
  };
};

export const buildOrderLineLifecycle = (order: OrderDetailsFragment): OrderLineLifecycle[] => {
  const restockWarehouseByComposedId = buildFulfillmentRestockWarehouseMap(order.events);

  return (order.lines ?? []).map(line =>
    buildLineLifecycle(line, order, restockWarehouseByComposedId),
  );
};
