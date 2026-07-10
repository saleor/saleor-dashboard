import {
  FulfillmentStatus,
  type OrderDetailsFragment,
  type OrderEventFragment,
  OrderEventsEnum,
  OrderGrantedRefundStatusEnum,
  OrderStatus,
} from "@dashboard/graphql";
import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";

import {
  buildFulfillmentRestockWarehouseMap,
  buildOrderLineLifecycle,
  getFulfillmentWarehouseDisplay,
} from "./buildOrderLineLifecycle";

const createFulfillmentLine = (
  orderLine: OrderDetailsFragment["lines"][number],
  quantity: number,
) => ({
  __typename: "FulfillmentLine" as const,
  id: `fulfillment-line-${orderLine.id}-${quantity}`,
  quantity,
  reason: null,
  reasonReference: null,
  orderLine,
});

const createOrderWithFulfillments = (
  overrides: Partial<OrderDetailsFragment>,
): OrderDetailsFragment => {
  const base = OrderFixture.fulfilled().build();

  return {
    ...base,
    ...overrides,
    lines: overrides.lines ?? base.lines,
    fulfillments: overrides.fulfillments ?? base.fulfillments,
    grantedRefunds: overrides.grantedRefunds ?? base.grantedRefunds,
  };
};

describe("buildOrderLineLifecycle", () => {
  it("aggregates shipped quantity from fulfilled fulfillments", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      lines: [{ ...line, quantity: 5, quantityToFulfill: 2, quantityFulfilled: 3 }],
      fulfillments: [
        {
          __typename: "Fulfillment",
          id: "fulfillment-1",
          status: FulfillmentStatus.FULFILLED,
          fulfillmentOrder: 1,
          trackingNumber: "TRACK-1",
          created: "2023-10-01T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
          lines: [createFulfillmentLine(line, 3)],
        },
      ],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.shipped).toBe(3);
    expect(lifecycle.toFulfill).toBe(2);
    expect(lifecycle.ordered).toBe(5);
    expect(lifecycle.shipments).toHaveLength(1);
    expect(lifecycle.shipments[0].displayId).toBe("#12345-1");
  });

  it("aggregates returned and refunded quantities from terminal fulfillments", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      status: OrderStatus.PARTIALLY_RETURNED,
      fulfillments: [
        {
          __typename: "Fulfillment",
          id: "fulfillment-returned",
          status: FulfillmentStatus.RETURNED,
          fulfillmentOrder: 2,
          trackingNumber: "",
          created: "2023-10-02T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
          lines: [createFulfillmentLine(line, 1)],
        },
        {
          __typename: "Fulfillment",
          id: "fulfillment-refunded",
          status: FulfillmentStatus.REFUNDED_AND_RETURNED,
          fulfillmentOrder: 3,
          trackingNumber: "",
          created: "2023-10-03T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
          lines: [createFulfillmentLine(line, 2)],
        },
      ],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.returned).toBe(3);
    expect(lifecycle.refundedFulfillment).toBe(2);
  });

  it("counts pending approval and replaced quantities separately", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      fulfillments: [
        {
          __typename: "Fulfillment",
          id: "fulfillment-waiting",
          status: FulfillmentStatus.WAITING_FOR_APPROVAL,
          fulfillmentOrder: 1,
          trackingNumber: "",
          created: "2023-10-01T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
          lines: [createFulfillmentLine(line, 1)],
        },
        {
          __typename: "Fulfillment",
          id: "fulfillment-replaced",
          status: FulfillmentStatus.REPLACED,
          fulfillmentOrder: 2,
          trackingNumber: "",
          created: "2023-10-02T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
          lines: [createFulfillmentLine(line, 1)],
        },
      ],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.pendingApproval).toBe(1);
    expect(lifecycle.replaced).toBe(1);
  });

  it("includes canceled fulfillments in shipments but not quantity buckets", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      fulfillments: [
        {
          __typename: "Fulfillment",
          id: "fulfillment-canceled",
          status: FulfillmentStatus.CANCELED,
          fulfillmentOrder: 4,
          trackingNumber: "",
          created: "2023-10-04T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
          lines: [createFulfillmentLine(line, 2)],
        },
      ],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.shipped).toBe(0);
    expect(lifecycle.shipments).toHaveLength(1);
    expect(lifecycle.shipments[0].status).toBe(FulfillmentStatus.CANCELED);
  });

  it("attaches restock warehouse to canceled shipments from order events", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      number: "12345",
      fulfillments: [
        {
          __typename: "Fulfillment",
          id: "fulfillment-canceled",
          status: FulfillmentStatus.CANCELED,
          fulfillmentOrder: 4,
          trackingNumber: "",
          created: "2023-10-04T12:00:00Z",
          reason: null,
          reasonReference: null,
          warehouse: { __typename: "Warehouse", id: "wh-source", name: "Europe" },
          lines: [createFulfillmentLine(line, 2)],
        },
      ],
      events: [
        {
          __typename: "OrderEvent",
          id: "cancel-event",
          type: OrderEventsEnum.FULFILLMENT_CANCELED,
          composedId: "12345-4",
          date: "2023-10-04T12:01:00Z",
          warehouse: null,
          related: null,
        },
        {
          __typename: "OrderEvent",
          id: "restock-event",
          type: OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS,
          composedId: null,
          date: "2023-10-04T12:01:01Z",
          quantity: 2,
          warehouse: { __typename: "Warehouse", id: "wh-restock", name: "Oceania" },
          related: null,
        },
      ] as OrderEventFragment[],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.shipments[0].warehouse).toMatchObject({
      id: "wh-source",
      name: "Europe",
    });
    expect(lifecycle.shipments[0].restockWarehouse).toMatchObject({
      id: "wh-restock",
      name: "Oceania",
    });
  });

  it("pairs cancel and restock events by sequence rather than related id", () => {
    // Arrange
    const events = [
      {
        __typename: "OrderEvent",
        id: "cancel-event",
        type: OrderEventsEnum.FULFILLMENT_CANCELED,
        composedId: "292-5",
      },
      {
        __typename: "OrderEvent",
        id: "restock-event",
        type: OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS,
        warehouse: { __typename: "Warehouse", id: "wh-oceania", name: "Oceania" },
        related: null,
      },
    ] as unknown as OrderEventFragment[];

    // Act
    const restockMap = buildFulfillmentRestockWarehouseMap(events);

    // Assert
    expect(restockMap.get("292-5")).toEqual({ id: "wh-oceania", name: "Oceania" });
  });

  it("hides duplicate source warehouse when restock destination matches", () => {
    // Arrange
    const events = [
      {
        __typename: "OrderEvent",
        id: "cancel-event",
        type: OrderEventsEnum.FULFILLMENT_CANCELED,
        composedId: "292-5",
      },
      {
        __typename: "OrderEvent",
        id: "restock-event",
        type: OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS,
        warehouse: { __typename: "Warehouse", id: "wh-europe", name: "Europe" },
        related: null,
      },
    ] as unknown as OrderEventFragment[];

    // Act
    const display = getFulfillmentWarehouseDisplay(
      { number: "292", events },
      {
        status: FulfillmentStatus.CANCELED,
        fulfillmentOrder: 5,
        warehouse: { id: "wh-europe", name: "Europe" },
      },
    );

    // Assert
    expect(display.sourceWarehouse).toBeUndefined();
    expect(display.restockWarehouse).toEqual({ id: "wh-europe", name: "Europe" });
  });

  it("does not attach restock warehouse when cancel is not followed by restock event", () => {
    // Arrange
    const events = [
      {
        __typename: "OrderEvent",
        id: "cancel-event",
        type: OrderEventsEnum.FULFILLMENT_CANCELED,
        composedId: "292-5",
      },
      {
        __typename: "OrderEvent",
        id: "note-event",
        type: OrderEventsEnum.NOTE_ADDED,
      },
    ] as unknown as OrderEventFragment[];

    // Act
    const restockMap = buildFulfillmentRestockWarehouseMap(events);

    // Assert
    expect(restockMap.has("292-5")).toBe(false);
  });

  it("builds restock warehouse map from cancel and restock events", () => {
    // Arrange
    const events = [
      {
        __typename: "OrderEvent",
        id: "cancel-event",
        type: OrderEventsEnum.FULFILLMENT_CANCELED,
        composedId: "292-1",
      },
      {
        __typename: "OrderEvent",
        id: "restock-event",
        type: OrderEventsEnum.FULFILLMENT_RESTOCKED_ITEMS,
        warehouse: { __typename: "Warehouse", id: "wh-2", name: "West" },
        related: null,
      },
    ] as unknown as OrderEventFragment[];

    // Act
    const restockMap = buildFulfillmentRestockWarehouseMap(events);

    // Assert
    expect(restockMap.get("292-1")).toEqual({ id: "wh-2", name: "West" });
  });

  it("sums granted refund quantities per order line", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      grantedRefunds: [
        {
          __typename: "OrderGrantedRefund",
          id: "granted-refund-1",
          status: OrderGrantedRefundStatusEnum.SUCCESS,
          amount: { __typename: "Money", amount: 10, currency: "USD" },
          reason: "Refund",
          createdAt: "2023-10-05T12:00:00Z",
          reasonReference: null,
          user: null,
          app: null,
          shippingCostsIncluded: false,
          transactionEvents: [],
          lines: [
            {
              __typename: "OrderGrantedRefundLine",
              id: "granted-line-1",
              quantity: 2,
              reason: null,
              reasonReference: null,
              orderLine: {
                __typename: "OrderLine",
                id: line.id,
                productName: line.productName,
                variantName: line.variant?.name ?? "",
                thumbnail: null,
              },
            },
          ],
        },
      ],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.grantedRefund).toBe(2);
  });

  it("sums allocation quantities for allocated column", () => {
    // Arrange
    const line = OrderFixture.fulfilled().build().lines[0];
    const order = createOrderWithFulfillments({
      lines: [
        {
          ...line,
          allocations: [
            {
              __typename: "Allocation",
              id: "allocation-1",
              quantity: 2,
              warehouse: { __typename: "Warehouse", id: "wh-1", name: "East" },
            },
            {
              __typename: "Allocation",
              id: "allocation-2",
              quantity: 1,
              warehouse: { __typename: "Warehouse", id: "wh-2", name: "West" },
            },
          ],
        },
      ],
      fulfillments: [],
    });

    // Act
    const [lifecycle] = buildOrderLineLifecycle(order);

    // Assert
    expect(lifecycle.allocated).toBe(3);
  });

  it("builds lifecycle rows for every order line", () => {
    // Arrange
    const order = OrderFixture.fulfilled().build();
    const secondLine = { ...order.lines[0], id: "line-id-2", productName: "Second product" };
    const orderWithTwoLines = createOrderWithFulfillments({
      lines: [order.lines[0], secondLine],
    });

    // Act
    const lifecycles = buildOrderLineLifecycle(orderWithTwoLines);

    // Assert
    expect(lifecycles).toHaveLength(2);
    expect(lifecycles.map(row => row.orderLineId)).toEqual(["line-id-1", "line-id-2"]);
  });
});
